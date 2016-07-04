var Vue = require("vue"),
    _ = require("underscore"),
    $ = require("jquery");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");

//插件
require("plugin/confirm/jquery-confirm");


module.exports = Vue.component("edit-box", {
    template: __inline("index.jade"),


    created: function(){
        var _this = this;
        $(document).on("click", ".tabItem", showTabBlock);
        $(document).on("click", ".infoList li, .picItem", msgActive);


        //获取选中菜单的类型内容

        //comjs.ajaxGet(
        //    api.getMaterialInfo,
        //    {
        //        appid: comjs.getLocalItem("appid"),
        //        media_id: "YLcQYmN80mTJ_JbrPd6L6-R62X4_FfDAO4iNfdE0o0A",
        //        media_type: "news"
        //    },
        //    function(json){
        //        console.log(json);
        //        //_this.menuMediaInfo = json.data;
        //    }
        //);
    },
    props: ["items", "chkitem", "sortable", "parentidx", "subidx", "reset", "chkmedia", "medialist"],
    data: function(){
        return {
            username: comjs.getLocalItem("username"),
            appid: comjs.getLocalItem("appid")
        }
    },
    computed: {

    },
    watch: {
        "chkitem": {
            handler: function (val, oldval) {
                initEditBoxStatus(val.type);
            }
        }
    },

    methods: {
        showLog: function(){
            alert(JSON.stringify(this.logData));
        },
        delItem: function(){
            var _this = this;

            var temp = _.template(__inline("plugin/confirm/templates/msgtip.jade"));
            if(_this.subidx == null){
                $.confirm({
                    title: false,
                    content: temp(_this.chkitem),
                    columnClass: 'col-md-8 col-md-offset-2',
                    confirmButtonClass: 'btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton: "确定",
                    cancelButton: "取消",
                    animation: "opacity",
                    backgroundDismiss: true,
                    confirm: function(){
                        _this.items.$remove(_this.chkitem);
                        _this.medialist.$remove(_this.chkmedia);
                        _this.reset = true;

                    },
                    cancel: function(){

                    }
                });

            }else{
                $.confirm({
                    title: false,
                    content: temp(_this.chkitem),
                    columnClass: 'col-md-8 col-md-offset-2',
                    confirmButtonClass: 'btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton: "确定",
                    cancelButton: "取消",
                    animation: "opacity",
                    backgroundDismiss: true,
                    confirm: function(){

                        _this.items[_this.parentidx].sub_button.$remove(_this.chkitem);
                        _this.medialist[_this.parentidx].sub_button.$remove(_this.chkmedia);
                        _this.reset = true;


                    },
                    cancel: function(){

                    }
                });
            }

        },
        showAppMsgBox: function(type){
            var _this = this;
            var columnClass, defaultColumnClass = "col-md-10 col-md-offset-1";
            var temp, mediaType, ajaxApi;
            var mediaType = {
                appmsg: "view_limited",
                apppic: "media_id",
                appaudio: "voice",
                appvideo: "video"
            }
            ajaxApi = api.getMedialist;
            switch(type){
                case "appmsg":
                    temp = _.template(__inline("plugin/confirm/templates/appmsg.jade"));
                    //mediaType = "news";
                    ajaxApi = api.getNews;
                    break;
                case "apppic":
                    temp = _.template(__inline("plugin/confirm/templates/apppic.jade"));
                    //mediaType = "image";
                    break;
                case "appaudio":
                    temp = _.template(__inline("plugin/confirm/templates/appaudio.jade"));
                    //mediaType = "voice";
                    break;
                case "appvideo":
                temp = _.template(__inline("plugin/confirm/templates/appvideo.jade"));
                    //mediaType = "video";
                    break;
                case "appview":
                    temp = _.template(__inline("plugin/confirm/templates/appview.jade"));
                    columnClass = "col-md-8 col-md-offset-2";
                    break;
            }
            comjs.ajaxGet(
                ajaxApi,
                {appid: _this.appid, username: _this.username, pageNum: 0, pageSize: 5, mediaType: mediaType[type]},
                function(json){
                    if(json.code == 0) {
                        var data;
                        if(type == "appmsg"){
                            var _data = JSON.parse(json.data);
                            data = _data.item;
                        }else{
                            var _data = json.data;
                            data = _data.list
                        }

                        $.confirm({
                            title: false,
                            content: temp(data),
                            columnClass: columnClass || defaultColumnClass,
                            confirmButtonClass: 'btn-info',
                            cancelButtonClass: 'btn-danger',
                            confirmButton: "确定",
                            cancelButton: "取消",
                            animation: "opacity",
                            backgroundDismiss: true,
                            confirm: function(){
                                var index = $("#dataList li.selected .dIndex").html();
                                //saveDate.apply(_this, [type, data.item[index]]);
                                saveDate.apply(_this, [mediaType[type], data[index]]);
                            },
                            cancel: function(){

                            }
                        });
                    }

                }
            );

        },
        delChkMedia: function(){
            var _this = this;
            _this.chkmedia.data = null;
            _this.chkmedia.type = null;
            //_this.medialist.$remove(_this.chkmedia);
        }
    }
});



function saveDate(type, item){

    var _this = this;
    switch(type){
        case "view_limited":
            _this.chkmedia.data = item.content;
            _this.chkmedia.type = type;

            _this.chkitem.media_id = item.media_id;
            _this.chkitem.type = type;
            break;
        case "media_id":
            _this.chkmedia.data = item.local_url;
            _this.chkmedia.type = type;

            _this.chkitem.media_id = item.media_id;
            _this.chkitem.type = type;
    }

}


//当检测到菜单类型变化时,标示模板上的菜单类型状态
function initEditBoxStatus(type){
    var tabType;
    switch(type){
        case "view":
            tabType = "view";
            break;
        case "media_id":
            tabType = "img";
            break;
        case "view_limited":
            tabType = "news";
            break;
    }
    $("[data-tab="+tabType+"]").addClass("selected")
        .siblings()
        .removeClass("selected");
    $("#"+tabType).show()
        .siblings()
        .hide();
}



function showTabBlock(){
    var _this = $(this),
        tabBlock = _this.data("tab");
    _this.addClass("selected")
        .siblings()
        .removeClass("selected");
    $(".tabBlock").children("#"+tabBlock)
        .show()
        .siblings()
        .hide();
}

function msgActive(){
    var _this = $(this);
    _this.addClass("selected")
        .siblings()
        .removeClass("selected")
}

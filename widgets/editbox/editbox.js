var $ = require("jquery"),
    Vue = require("vue"),
    //vue_resource = require("vue-resource"),
    _ = require("underscore");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");

//插件
require("plugin/loading/jquery.waiting");
require("plugin/confirm/index");
var toastr = require("plugin/toast/toastr");
toastr.options = {
    "closeButton": false,
    "debug": false,
    "positionClass": "toast-top-center",
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

//Vue.use(require("vue-resource"));  //xmlHttpRequest
//加载jquery插件
require("plugin/confirm/index");  //模态框组件


module.exports = Vue.component("edit-box", {
    template: __inline("editbox.jade"),

    ready: function(){
        var _this = this;
        $('#main').waiting({fixed: true});

        comjs.ajaxGet(
            api.getReplyInfo,
            {
                appid: comjs.getLocalItem("appid"),
                category_type: _this.type
            },
            function(json){
                if(json.data.length){
                    console.log(JSON.stringify(json.data));
                    _this.data = json.data;
                    initEditBoxStatus(_this.data[0].content_type);
                    if(_this.data[0].content_type == "img"){
                        initPic.apply(_this);

                    }
                }
                $('#main').waiting("done");
            }
        )

        $(document).on("click", ".tabItem", showTabBlock);
        $(document).on("click", ".infoList li, .picItem", msgActive);
        $(document).on("input propertychange", ".editContent", statInputNum);
        $(document).on("click", "#delMedia", function(){
            delMedia.apply(_this);
        });
    },
    props: ["type"],
    data: function(){
        return {
            data: [],
            inserData: {}
        }
    },
    watchs: {

    },
    methods: {
        showAppMsgBox: function(type){
            var _this = this;
            var temp;

            var mediaType = {
                apppic: "media_id",
                appaudio: "voice",
                appvideo: "video"
            }
            ajaxApi = api.getMedialist;
            switch(type){

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

            }
            comjs.ajaxGet(
                ajaxApi,
                {
                    appid: comjs.getLocalItem("appid"),
                    username: comjs.getLocalItem("username"),
                    pageNum: 1,
                    pageSize: 5,
                    mediaType: mediaType[type]
                },
                function(json){
                    if(json.code == 0) {
                        var data = json.data;

                        $.confirm({
                            title: false,
                            content: temp(data.list),
                            columnClass: 'col-md-10 col-md-offset-1',
                            confirmButtonClass: 'btn-info',
                            cancelButtonClass: 'btn-danger',
                            confirmButton: "确定",
                            cancelButton: "取消",
                            animation: "opacity",
                            backgroundDismiss: true,
                            confirm: function(){
                                if(type == "apppic"){
                                    var mediaId = $("#dataList li.selected #mediaId").html();
                                    $("#mediaId").val(mediaId);
                                    $("#addPic").hide();
                                    initPic.apply(_this, [mediaId]);
                                }

                            },
                            cancel: function(){

                            }
                        });
                    }

                }
            );



        },
        saveDate: function(){

            var _this = this;

            //alert(_this.data == false);
            if(_this.data == false) {
                _this.addDate();
                return false;
            }

            var type = $(".tabItem.selected").data("tab");
            if(type == "text"){
                if(!$("#editContent").val()){
                    toastr.warning("请添加内容");
                    return false;
                }
                _this.data[0].content_text = $("#editContent").val();
                _this.data[0].content_type = "text";
                $("#imgBox").remove();
            }else if(type == "pic") {
                if(!$("#mediaId").val()){
                    toastr.warning("请选择图片");
                    return false;
                }
                _this.data[0].content_text = $("#mediaId").val();
                _this.data[0].content_type = "img";
            }


            comjs.ajaxGet(
                api.saveReplyRule,
                {
                    id: _this.data[0].id,
                    appid: comjs.getLocalItem("appid"),
                    data: JSON.stringify(_this.data[0])
                },
                function(json){
                    if(json.code == 0){
                        toastr.success("内容保存成功");
                        //location.reload();
                    }
                }
            );
        },
        addDate: function(){
            var _this = this;

            var inserData = {
                "reply_list_info": "",
                "create_time": "",
                "rule_name": "",
                "from_wx": false,
                "content_text": "",
                "category_type": _this.type,
                "is_add_friend_reply_open": 0,
                "content_type": "",
                "is_autoreply_open": 0,
                "keyword_list_info": "",
                "reply_mode": "",
                "id": 0,
                "app_id": comjs.getLocalItem("appid"),
                "status": false
            }


            var type = $(".tabItem.selected").data("tab");
            if(type == "text"){
                if(!$("#editContent").val()){
                    toastr.warning("请填写内容");
                    return false;
                }
                inserData.content_text = $("#editContent").val();
                inserData.content_type = "text";
            }else if(type == "pic") {
                if(!$("#mediaId").val()){
                    toastr.warning("请添加图片");
                    return false;
                }
                inserData.content_text = $("#mediaId").val();
                inserData.content_type = "img";
            }

            comjs.ajaxGet(
                api.saveReplyRule,
                {
                    id: 0,
                    appid: comjs.getLocalItem("appid"),
                    data: JSON.stringify(inserData)
                },
                function(json){
                    if(json.code == 0){
                        toastr.success("内容添加成功");
                        //location.reload();
                    }
                }
            );

        },
        delDate: function(){
            var _this = this;
            //_this.data[0].content_text = "";
            //if(_this.data[0].content_type == "img") {
            //    $(".imgBox").remove();
            //}

            var temp = _.template(__inline("plugin/confirm/templates/infotips.jade"));
            var obj = {
                tipstr: "是否确认删除信息"
            }

            $.confirm({
                title: false,
                //content: __inline("plugin/confirm/templates/infotips.jade"),
                content: temp(obj),
                columnClass: 'col-md-10 col-md-offset-1',
                confirmButtonClass: 'btn-info',
                cancelButtonClass: 'btn-danger',
                confirmButton: "确定",
                cancelButton: "取消",
                animation: "opacity",
                backgroundDismiss: true,
                confirm: function(){

                    comjs.ajaxGet(
                        api.delAutoRelyMsg,
                        {
                            id: _this.data[0].id,
                            appid: comjs.getLocalItem("appid")
                        },
                        function(json){
                            console.log(json)
                            if(json.code == 0 && json.data == "1") {
                                toastr.success("回复信息删除成功");
                                location.reload();
                            }
                        }
                    );

                },
                cancel: function(){

                }
            });



        }
    }
});


//当检测到类型变化时,标示模板上的类型状态
function initEditBoxStatus(type){
    var tabType;
    switch(type){
        case "text":
            tabType = "text";
            break;
        case "img":
            tabType = "pic";
            break;
    }
    $("[data-block="+tabType+"]").show()
        .siblings()
        .hide();
    $("[data-tab="+tabType+"]").addClass("selected")
        .siblings()
        .removeClass("selected");

}

function showTabBlock(){

    var _this = $(this),
        tabBlock = _this.data("tab");
    _this.addClass("selected")
        .siblings()
        .removeClass("selected");
    $("[data-block="+tabBlock+"]")
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

function statInputNum(){
    var $editor = $(this),
        $parent = $editor.parent(),
        $wordNum = $parent.find("#wordNum"),
        $wordCount = $parent.find("#wordCount"),
        wordCount = $wordCount.text();
    $editor.attr("maxlength", wordCount);
    var wordNum = $editor.val().length;
    $wordNum.html(wordCount-wordNum);

}

function initPic(mediaId){
    var _this = this;
    //if(_this.data[0].content_type != "img" || !_this.data[0].content_text.length) return false;
    var mid;
    var temp = _.template($("#imgTemp").html());
    var apiAdd;
    if(_this.data[0]&&mediaId==null){
        apiAdd = _this.data[0].from_wx ? api.getMaterialInfo : api.getTempMaterial;
        mid = _this.data[0].content_text;

    }else{
        apiAdd = api.getMaterialInfo;
        mid = mediaId;
    }
    comjs.ajaxGet(
        apiAdd,
        {
            appid: comjs.getLocalItem("appid"),
            media_id: mid,
            media_type: "image"
        },
        function(json){
            console.log(json);
            var ele = temp(json.data);

            $("#pic").append(ele);
        }
    )
}


function delMedia(){
    var _this = this;
    $("#addPic").show();
    $(".imgBox").remove();
}
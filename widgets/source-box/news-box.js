var $ = require("jquery"),
    Vue = require("vue");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");

//plugin
require("plugin/tooltips/tooltips");
require("plugin/popmodal/popmodal");
require("plugin/loading/jquery.waiting");
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

module.exports = Vue.component("news-box", {
    template: __inline("news-box.jade"),
    activate: function(ready){
        var _this = this;
        $('#main').waiting({ fixed: true });
        comjs.ajaxGet(
            api.getNews,
            {appid: _this.appid, username: _this.username, pageNum: 0, pageSize: 5, mediaType: "news"},
            function(json){
                if(json.code == 0){
                    var data = JSON.parse(json.data);
                    _this.newsList = data.item;
                    console.log(JSON.stringify(data.item));
                    $('#main').waiting("done");
                    ready();
                }else{
                    $('#main').waiting("done");
                    ready();
                }
            },
            function(){
                toastr.warning("数据获取失败,请重新刷新页面");
            }
        );
    },
    init: function(){

    },
    created: function(){

    },
    compiled: function(){

    },
    ready: function(){
        //var _this = this;
        //comjs.ajaxGet(
        //    api.getNews,
        //    {appid: _this.appid, username: _this.username, pageNum: 0, pageSize: 5, mediaType: "news"},
        //    function(json){
        //        if(json.code == 0){
        //            var data = JSON.parse(json.data);
        //            _this.newsList = data.item;
        //            console.log(JSON.stringify(data.item));
        //        }
        //    }
        //);
        //
        //$('.tips').tipso({
        //    useTitle: false,
        //    width: "50px",
        //    position: 'top',
        //    background: "#000000"
        //});



    },
    data: function(){
        return {
            appid: comjs.getLocalItem("appid"),
            username: comjs.getLocalItem("username"),
            formatType: "grid",
            newsList: [],
            toggleCheck: false,
            chkMediaId: []
        }
    },
    filters: {
        getDate: function(tm){
            //return new Date(parseInt(tm) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            var date = new Date(parseInt(tm) * 1000);
            return (parseInt(date.getMonth())+1) + "月" + date.getDate() + "日";
        }
    },
    methods: {
        formatStyle: function(type){
            this.formatType = type;
        },
        toggleMulCheck: function(evt){
            var _this = this;
            var $target = $(evt.target);
            if(_this.toggleCheck){
                $target.html("多选")
            }else{
                $target.html("取消多选")
            }
            _this.toggleCheck = !_this.toggleCheck;
        },
        eidtMediaItem: function(evt){
            var $target = $(evt.target);
            var sign = $target.data("editkey")
            $("[data-editkey="+sign+"]").popModal({
                html : __inline("plugin/popmodal/templates/editSourceName.jade"),
                placement : 'bottomCenter',
                showCloseBut : true,
                onDocumentClickClose : true,
                onOkBut : function(){
                    var $input = $("body").find("#keyinput"), //$("#keyinput"),
                        value = $input.val();
                    if(!checkVal(value, $input)) return false;

                },
                onCancelBut : function(){ },
                onLoad : function(){ },
                onClose : function(){ }
            });
        },
        delMulItem: function(){
            var _this = this;
            var $js_check = $(".js_isCheck:checked");
            if(!$js_check.length){
                toastr.warning("请勾选要删除的项目");
                return false;
            }
            var media_ids = [];
            var media_keys = [];
            $js_check.each(function(){
                var $this = $(this);
                var key = $this.val();
                //console.log($this.children("input[type='hidden']"));
                var mediaId = $this.parent().children("input[type='hidden']").val();
                media_ids.push(mediaId);
                media_keys.push(key);
            });
            //console.log(media_ids.join(","));
            media_ids = media_ids.join(",");
            comjs.ajaxGet(
                api.delMedias,
                {
                    appid: comjs.getLocalItem("appid"),
                    username: comjs.getLocalItem("username"),
                    mediaType: "image",
                    media_ids: media_ids
                },
                function(json){
                    if(json.code == 0) {
                        toastr.success("图文删除成功");
                        //delData.apply(_this, [media_keys]);
                        location.reload();
                        //_this.newsList.$remove(item);
                    }
                }
            );
        },
        delMediaItem: function(item, evt){
            var _this = this;
            var $target = $(evt.target);
            var delkey = $target.data("delkey");
            $("[data-delkey="+delkey+"]").popModal({
                html : __inline("/plugin/popmodal/templates/sureDel.jade"),
                placement : 'bottomCenter',
                showCloseBut : true,
                onDocumentClickClose : true,
                onOkBut : function(){
                    comjs.ajaxGet(
                        api.delMedias,
                        {
                            appid: comjs.getLocalItem("appid"),
                            username: comjs.getLocalItem("username"),
                            mediaType: "news",
                            media_ids: delkey
                        },
                        function(json){
                            if(json.code == 0) {
                                toastr.success("图文删除成功");
                                _this.newsList.$remove(item);
                            }else{
                                toastr.warning("素材被使用,不能删除");
                            }
                        }
                    )
                },
                onCancelBut : function(){ },
                onLoad : function(){ },
                onClose : function(){ }
            });
        }
    }

});

function checkVal(value, $ele){
    if(!value||!value.length) {
        $ele.css("border", "1px solid red");
        return false;
    }
    return true;
}

function delData(keys){
    var _this = this;
    keys.forEach(function(v){
        _this.newsList.$remove(_this.newsList[v]);
    })
}
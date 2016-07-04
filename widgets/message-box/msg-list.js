var $ = require("jquery"),
    Vue = require("vue");

var comjs = require("pages/common/glob"),
    api = require("pages/common/interface");

//组件
require("widgets/pagebar/pager");

//插件
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

module.exports = Vue.component("msg-list", {
    template: __inline("msg-list.jade"),
    activate: function(ready){
        var _this = this;
        $("#main").waiting({fixed: true});
        comjs.ajaxGet(
            api.getWxMsg,
            {
                appid: comjs.getLocalItem("appid")
            },
            function(json){
                if(json.code == 0){
                    console.log(json);
                    _this.msgList = json.data.list;
                    _this.pageInfo = comjs.buildPageInfo(json.data, "getMsgList");
                    $("#main").waiting("done");
                    ready();
                }

            }
        );
    },
    ready: function(){
        //点击出现/关闭回复框
        $(document).on("click", "a.reply", function(){
            var $this = $(this),
                $item = $this.parent().parent().parent();
            $item.addClass("replyShow")
                .siblings()
                .removeClass("replyShow");
        });
        $(document).on("click", "button.hideReply", function(){
            var $this = $(this),
                $item = $this.parent().parent().parent().parent();
            $item.removeClass("replyShow");
        });
    },
    filters: {
        getTime: function(d){
            var date = new Date(d);
            var now = new Date();
            var now_day = now.getDay();
            var dayStr = ["星期日", "星期一", "星期二", "星期四", "星期五", "星期六"];
            var reDayStr = now.getDay() - date.getDay() == 1 ?  "昨天" : (now.getDay() - date.getDay() == 0 ? "今天" : dayStr[date.getDay()-1]);
            return reDayStr + " " + date.getHours() + ":" + date.getMinutes();
        }
    },
    data: function(){
        return {
            msgList: [],
            pageInfo: {}
        }
    },
    methods: {
        replyMsg: function(id, evt){
            var _this = this;
            var $target = $(evt.target),
                $parent = $target.parent().parent().parent().parent(),
                $textarea = $parent.find("textarea"),
                val = $textarea.val(),
                $replyStatus = $parent.find(".replyStatus");
            comjs.ajaxGet(
                api.replyMsg,
                {
                    id: id,
                    appid: comjs.getLocalItem("appid"),
                    content: val
                },
                function(json){
                    console.log(json);
                    if(json.code == 0){
                        $textarea.val("");
                        $replyStatus.html("已回复");
                        toastr.success("信息回复成功");
                        _this.getMsgList(_this.nowPage)
                    }
                }
            );
        },
        getMsgList: function(page){
            var _this = this;
            $("#main").waiting({fixed: true});
            comjs.ajaxGet(
                api.getWxMsg,
                {
                    appid: comjs.getLocalItem("appid"),
                    pageNum: page
                },
                function(json){
                    console.log(json);
                    if(json.code == 0){
                        _this.msgList = json.data.list;
                        _this.pageInfo = comjs.buildPageInfo(json.data, "getMsgList");
                        $("#main").waiting("done");
                    }
                }
            );
        }
    }
});
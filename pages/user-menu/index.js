var Vue = require("vue"),
    $ = require("jquery");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");

//载入组件
var compSort = require("widgets/menu_left_box/index");



//加载jquery插件
//require("widgets/confirm/index");  //模态框插件
//require("plugin/toast/toastr.min");


var app = new Vue({
    el: "#main",
    ready: function(){
        var _this = this;

    },
    data: {
        isChkApp: comjs.isChkApp()
    }
});



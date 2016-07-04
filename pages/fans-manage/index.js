var $ = require("jquery"),
    Vue = require("vue");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");

require("widgets/fans-box/index");
require("widgets/appinfo/applist");

var app = new Vue({
    el: "#main",
    ready: function() {
        var _this = this;


    },
    data: {
        isChkApp: comjs.isChkApp()
    }
});
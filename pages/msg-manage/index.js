var $ = require('jquery'),
    Vue = require("vue");

var comjs = require("pages/common/glob");

require("widgets/message-box/msg-list");
require("widgets/appinfo/applist");


var app = new Vue({
    el: "#main",
    created: function(){
        var _this = this;


    },

    data: {
        isChkApp: comjs.isChkApp()
    },
    methods: {

    }
});
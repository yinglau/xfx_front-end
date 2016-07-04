var $ = require("jquery");
var Vue = require("vue");

var comjs = require("glob"),
    api = require("interface");

//加载组件
var header = require("widgets/header/header");
var mulAppTab = require("widgets/mul-app-tab/index");
var sidebar = require("widgets/side-nav/nav");


comjs.ajaxGet(api.getUserInfo, {}, function(json){
    if(json.code == 0){

        var com = new Vue({
            el: "#common",
            ready: function(){
                var _this = this;

            },

            data: {
                username: json.data
            }
        });

    }else{
        location.href = "/pages/user/login.html";
    }
});

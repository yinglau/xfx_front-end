var $ = require("jquery"),
    Vue = require("vue");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");




module.exports = Vue.component("page-header", {
    template: __inline("header.jade"),
    ready: function(){
        var _this = this;
        comjs.setLocalItem("username", _this.username);

    },
    props: ["username"],

    methods: {

        logout: function(){
           comjs.ajaxGet(api.logout, {}, function(json){
               if(json.code == 0){
                   location.href="/pages/user/login.html";
                   comjs.rmLocalData();
               }
           })
        }
    }
});
var $ = require('jquery'),
    Vue = require("vue");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");

module.exports =  Vue.component("applist", {
    template: __inline("applist.jade"),
    ready: function(){
        var _this = this;
        comjs.ajaxGet(api.getMulApp, {moduleType: _this.type}, function(json){
            console.log(json)
            if(json.code == 0){
                var data = JSON.parse(json.data);
                _this.applist = data;
            }
        });
    },

    data: function(){
        return {
            applist: []
        }
    },
    props: ["type"],
    methods: {
        viewInfo: function(appid){
            comjs.setLocalItem("appid", appid);
            location.href = "/pages/index/appinfo.html#" + appid;
        }
    }
});

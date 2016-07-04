var $ = require('jquery'),
    Vue = require("vue");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");

module.exports =  Vue.component("appview", {
    template: __inline("appview.jade"),
    ready: function(){
        var _this = this;
        var hash = location.hash;
        comjs.ajaxGet(api.getAppInfo, {appid: hash.replace("#", "")}, function(json){
            console.log(json)
            if(json.code == 0){
                var data = JSON.parse(json.data);
                console.log(JSON.stringify(data))
                _this.appinfo = data;

            }
        });

    },
    data: function(){
        return {
            appinfo: {}
        }
    }
});

var $ = require("jquery"),
    Vue = require("vue");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");


require("plugin/confirm/index");  //模态框组件

module.exports = Vue.component("mul-app-tab", {
    template: __inline("index.jade"),
    created: function(){
        var _this = this;
        comjs.ajaxGet(api.getMulApp, {username: _this.username}, function(json){
            if(json.code == 0){
                var data = JSON.parse(json.data);
                _this.applist = data;
                //if(comjs.getLocalItem("appid") == null){ //默认设置第一个公众号的appid
                //    comjs.setLocalItem("appid", data[0].appid)
                //}
            }
        });

    },
    props: ["username"],
    data: function() {
        return {
            applist: [],
            chkApp: comjs.getLocalItem("appid") || null
        }
    },
    methods: {
        changeAppid: function(val, evt){
            var $target = $(evt.target);
            comjs.setLocalItem("appid", val);
            location.href = location.pathname;
        },
        viewInfo: function(appid){
            comjs.setLocalItem("appid", appid);
            location.href = "appinfo.html#" + appid;
            location.reload();
        },
        access: function(){
            var host = "http://gh.pincoak.com/wxmedia/?username=";
            location.href = host + comjs.getLocalItem('username');
        }
    }
});
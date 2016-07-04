var Vue = require("vue"),
    $ = require("jquery");


var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");


//组件
require("widgets/editbox/rule");
require("widgets/appinfo/applist");




var app = new Vue({
    el: "#main",
    created: function(){
        var _this = this;
        if(comjs.isChkApp()){
            comjs.ajaxGet(
                api.isOpenReplyStatus,
                {appid: comjs.getLocalItem("appid")},
                function(json){
                    if(json.data == "0"){
                        _this.isOpenReplyStatus = 0;
                    }else{
                        _this.isOpenReplyStatus = !0;
                    }
                }
            );

        }


    },
    ready: function(){

    },
    data: {
        isChkApp: comjs.isChkApp(),
        isOpenReplyStatus: false
    }
});



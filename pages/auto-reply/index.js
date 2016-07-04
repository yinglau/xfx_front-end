
//库,模块
var Vue = require("vue"),
    $ = require("jquery");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");


//组件
require("widgets/editbox/editbox");
require("widgets/appinfo/applist");


var main = new Vue({
    el: "#main",
    created: function(){
        var _this = this;

        _this.isChkApp = comjs.isChkApp();
        if(comjs.isChkApp()){
            if(comjs.getLocalItem("appid") != null){
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
                    //false
                );
            }
        }

    },
    data: {
        isChkApp: false,
        isOpenReplyStatus: false
    }
});


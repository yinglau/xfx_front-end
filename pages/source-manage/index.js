var $ = require("jquery"),
    Vue = require("vue");

var comjs = require("pages/common/glob"),
    api = require("pages/common/interface");

require("widgets/source-box/news-box");
require("widgets/appinfo/applist");


require("plugin/loading/jquery.waiting");
var toastr = require("plugin/toast/toastr");
toastr.options = {
    "positionClass": "toast-top-center",
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}


var newsBoxApp = new Vue({
    el: "#main",
    ready: function(){

    },
    data: {
        isChkApp: comjs.isChkApp()
    },
    methods: {
        synchMaterial: function(){
            $("#main").waiting({fixed: true});
            comjs.ajaxGet(
                api.synchMaterial,
                {
                    appid: comjs.getLocalItem("appid"),
                    username: comjs.getLocalItem("username")
                },
                function(json){
                    console.log(json);
                    if(json.code == 0){
                        $("#main").waiting("done");
                        toastr.success("素材已经同步");
                        setTimeout(function(){
                            location.reload();
                        }, 1000)
                    }
                }
            );
        }
    }
})
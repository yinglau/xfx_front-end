var $ = require('jquery'),
    Vue = require("vue"),
    _ = require("underscore");

var comjs = require("pages/common/glob"),
    api = require("pages/common/interface");

require("widgets/message-box/msg-list");
require("widgets/appinfo/applist");

var toastr = require("plugin/toast/toastr");
toastr.options = {
    "closeButton": false,
    "debug": false,
    "positionClass": "toast-top-center",
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}


var step_one = Vue.component("step_one", {
    template: "#step_one",
    ready: function(){
        var _this = this;
        $("#selectTemp").on("change", function(){
            var $this = $(this);
            _this.type = "temp01";
        });
    },
    data: function(){
        return {
            type: ""
        }
    },
    methods: {
        toCreateCode: function(){
            this.$parent.step = "step_second";
        }
    }
});

var step_second = Vue.component("step_second", {
    template: "#step_second",
    methods: {
        getQrCode: function(){
            var _this = this;
            comjs.ajaxGet(
                api.getQrcodeList,
                {
                    appid: comjs.getLocalItem("appid")
                },
                function(json){
                    console.log(json);
                    if(json.code == 0 && json.data.length > 0){
                        _this.$parent.qrcodeList = json.data;
                        _this.$parent.step = "qrcodeList";
                    }
                }
            );
        },
        createCode: function(){
            var _this = this;
            var $ele = $("input[name='weburl']");
            //$ele.forEach(function(v){
            //   if(v.val() != "") _this.weburl.push(v.val());
            //});
            //var urlReg = /^asdf$/;

            var urlReg = /^(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9]+(\.)com$/;
            var arr = [];

            _.each($ele, function(v){
                if($(v).val() != "") arr.push($(v).val());
            });

            if(!arr.length){
                toastr.error("没有填写地址,请填写至少一个地址");
                return false;
            }

            for(var i = 0; i < arr.length; i ++){
                if(!urlReg.test(arr[i])) {
                    toastr.error("不是正确的网址");
                    return false;
                }
            }



            comjs.ajaxGet(
                api.createQyQr,
                {
                    appid: comjs.getLocalItem("appid"),
                    username: comjs.getLocalItem("username"),
                    scene_str: "01",
                    web_str: arr.join(",")
                },
                function(json){
                    console.log(json);
                    if(json.code == 0 && json.data == "1"){
                        toastr.success("生成二维码成功");
                        _this.getQrCode();
                    }
                }
            );


        }
    },
    data: function(){
        return {

        }
    }
});


var qrcodeList = Vue.component("qrcodeList", {
    template: "#qrcodeList",
    data: function(){
        var _this = this;
        return {
            qrcodeList: _this.$parent.qrcodeList
        }
    },
    methods: {
        delQrCode: function(){
            var _this = this;
            comjs.ajaxGet(
                api.delQrcodeList,
                {
                    appid: comjs.getLocalItem("appid")
                },
                function(json){
                    console.log(json);
                    if(json.code == 0) {
                        toastr.success("删除成功");
                        _this.$parent.step = "step_one";
                    }
                }
            )
        }
    }
});

var app = new Vue({
    el: "#main",
    ready: function(){
        var _this = this;
        comjs.ajaxGet(
            api.getQrcodeList,
            {
                appid: comjs.getLocalItem("appid")
            },
            function(json){
                console.log(json);
                if(json.code == 0 && json.data.length > 0){
                    _this.qrcodeList = json.data;
                    _this.step = "qrcodeList";
                }
            }
        );
    },

    data: {
        isChkApp: comjs.getLocalItem("appid"),
        step: "step_second",
        qrcodeList: []
    },
    methods: {

    }
});
var $ = require("jquery");
var comjs = require("/pages/common/glob");
var api = require("/pages/common/interface");

require("plugin/loading/jquery.waiting");
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

$(document).ready(function(){
    if(comjs.getCookie("username")){
        $("#isremenber").attr("checked", "checked");
        $(".chkBox").addClass("check");
        $("#username").val(comjs.getCookie("username"));
    }

    $(".chkBox").on("click", function(){
        var $this = $(this);
        var ischeck = $("#isremenber");
        $this.toggleClass("check");
        if($this.hasClass("check")){
            ischeck.prop("checked", true);
        }else{
            ischeck.prop("checked", false);
        }
    });

    $(".logBtn").on("click", function(){
        $("body").waiting({fixed: true});
        var username, password, ischeck;
        console.log($("#username"))
        username = $("#username").val();
        password = $("#password").val();
        ischeck = $("#isremenber").is(":checked") ? 1 : 0;
        if(!username||!password) {
            toastr.warning("请正确输入账号或密码");
            return false;
        }else{
            var data = {
                username: username,
                password: password,
                ischeck: ischeck
            }
            comjs.ajaxGet(api.login, data, function(json){
                if(json.error_code == 0) {
                    $("body").waiting("done");
                    if(ischeck){
                        comjs.setCookie("username", username);
                    }else{
                        comjs.delCookie("username");
                    }
                    location.href="/pages/index/index.html";
                }else{
                    toastr.warning("账号或者密码错误,请重新输入!")
                }

            }, function(){

            });

        }

    });

});


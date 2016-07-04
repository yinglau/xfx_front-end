var $ = require("jquery");
var comjs = require("/pages/common/glob");
var api = require("/pages/common/interface");

var toastr = require("plugin/toast/toastr");  //通知插件toastr

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



    $(".chkBox").on("click", function(){
        var $this = $(this);
        var ischeck = $("#isAgree");
        $this.toggleClass("check");
        if($this.hasClass("check")){
            ischeck.prop("checked", true);
        }else{
            ischeck.prop("checked", false);
        }
    });

    $("#username").on("blur", function(){
        var $this = $(this);
        if($this.val()){
            comjs.ajaxGet(
                api.chkUser,
                {username: $this.val()},
                function(json){
                    if(json.code != 0){
                        toastr.warning(json.mes);
                    }else{
                        toastr.success("该用户名可以使用");
                    }
                }
            );
        }

    })

    $(".regBtn").on("click", function(){

        var username, password, password2, isAgree;
        username = $("#username").val();
        password = $("#password").val();
        password2 = $("#password2").val();
        isAgree = $("#isAgree").is(":checked");

        if(!username||!password) {
            //alert(username);
            //alert(password)
            toastr.error("账号和密码不能为空!");
            return false;
        }
        if(password != password2){
            toastr.error("两次输入的密码不同!");
            return false;
        }
        if(!isAgree) {
            toastr.error("请阅读并勾选同意协议");
            return false;
        }
        var data = {
            username: username,
            password: password
        }
        comjs.ajaxGet(api.reg, data, function(json){
            console.log(json);
            //if(json.status=="success"){
            //    location.href = "../user-menu/index.html";
            //}
            //alert("登录失败");
            if(json.code > 0) {
                toastr.error(json.mes);
            }else{
                location.href = "../user-menu/index.html";
            }

        }, function(){

        });

    });

});


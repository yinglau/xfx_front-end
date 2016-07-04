var $ = require("jquery"),
    Vue = require("vue");


var comjs = require("/pages/common/glob");

var links = [
    {
        name: "自动回复",
        url: "/pages/auto-reply/index.html"
    },
    {
        name: "自定义菜单",
        url: "/pages/user-menu/index.html"
    },
    {
        name: "用户管理",
        url: "/pages/fans-manage/index.html"
    },
    {
        name: "信息管理",
        url: "/pages/msg-manage/index.html"
    },
    {
        name: "素材管理",
        url: "/pages/source-manage/index.html"
    },
    {
        name: "数据中心",
        url: "/pages/data-center/fans-data.html"
    },
    {
        name: "二维码中心",
        url: "/pages/qrcode/index.html"
    }
];

var app = new Vue({
    el: "#sideBar",
    template: __inline("nav.jade"),
    ready: function(){

    },
    data: {
        links: links
    }
});

//function isChkApp(cat){
//    if(comjs.getLocalItem("appid") == null) {
//        var url = "/pages/" + cat + "/info.html";
//        return url;
//    }
//    return false;
//}
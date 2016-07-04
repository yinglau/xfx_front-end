var $ = require("jquery");

var comjs = {};
comjs = {
    ajaxGet: function(interface, data, success, error, async){ //ajax方法
        //var url = "http://localhost:8083/",
        var url = "http://rap.taobao.org/mockjs/4559/", //testurl
            formatUrl = url + interface.api;
        data = data || {};
        if(typeof error != "function") async = error;
        $.ajax({
            url: formatUrl,
            data: data,
            type: interface.method,
            success: success,
            error: error != undefined && typeof error == "function" ? error : function(){},
            async: async == undefined ? true : async,
            timeout: 15000,
            complete : function(xhr, status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                    xhr.abort(); //取消请求
                    $("#main").waiting("done");
                }
            }
        });
    },
    getCookie: function(key){ //获取cookie
        var res;
        var cookies = document.cookie.split("; ");
        cookies.forEach(function(v){
            var _cookie = v.split("=");
            if(_cookie[0] == key) res = _cookie[1];
            return;
        });
        return res;
    },
    setCookie: function(key, val, day){
        //获取当前时间
        var date=new Date();
        var expireDays = day;
        //将date设置为10天以后的时间
        date.setTime(date.getTime()+expireDays*24*3600*1000);
        //将userId和userName两个cookie设置为10天后过期
        document.cookie = key + "=" + val + "; expires="+date.toGMTString();
    },
    delCookie: function(key) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var val=this.getCookie(key);
        if(val!=null)
            document.cookie= key + "="+val+";expires="+exp.toGMTString();
    },
    setLocalItem: function(key, val){
        //localStorage.setItem(key, val);
        sessionStorage.setItem(key, val);
    },
    getLocalItem: function(key){
        //return localStorage.getItem(key);
        return sessionStorage.getItem(key);
    },
    rmLocalData: function(){
        //localStorage.clear();
        sessionStorage.clear();
    },
    isChkApp: function(){
        if(comjs.getLocalItem("appid") == null) {
            return 0;
        }
        return 1;
    },
    buildPageInfo: function(pinfo, act){
        var pageData = {
            firstPage: pinfo.firstPage,
            lastPage: pinfo.lastPage,
            pageNumber: pinfo.pageNumber,
            pageSize: pinfo.pageSize,
            totalPage: pinfo.totalPage,
            totalRow: pinfo.totalRow,
            action: act
        };
        return pageData;
    }
}
module.exports = comjs;
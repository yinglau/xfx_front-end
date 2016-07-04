var $ = require('jquery'),
    Vue = require("vue");

module.exports = Vue.component("pager", {
    template: __inline("pager.jade"),
    //activate: function(ready){
    //
    //    ready();
    //},
    ready: function(){

    },
    created: function(){

    },
    props: ["pinfo"],
    data: function(){
        return {
            nowPage: 1
        }
    },
    methods: {
        home: function(){
            var _this = this;
            _this.nowPage = 1;
            _this.$parent[_this.pinfo["action"]](1);
        },
        prev: function(){
            var _this = this;
            _this.nowPage -= 1;
            _this.$parent[_this.pinfo["action"]](_this.nowPage);
        },
        next: function(){
            var _this = this;
            _this.nowPage += 1;
            _this.$parent[_this.pinfo["action"]](_this.nowPage);
        },
        last: function(){
            var _this = this;
            _this.nowPage = _this.pinfo.totalPage;
            _this.$parent[_this.pinfo["action"]](_this.pinfo.totalPage);
        }
    }
});
var Vue = require("vue");
var $ = require("jquery");
var Sortable = require("sortable");
var json = require("service");
var editbox = require("widgets/menu_right_box/index");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");

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


var sort1 = {};
var
    options = {
        group: "menu",
        draggable: ".dragItem",
        //store: {
        //    get: function (menu_left_box) {
        //        var order = localStorage.getItem(menu_left_box.options.group);
        //        return order ? order.split('|') : [];
        //    },
        //    set: function (menu_left_box) {
        //        var order = menu_left_box.toArray();
        //        localStorage.setItem(menu_left_box.options.group, order.join('|'));
        //    }
        //}
    };


module.exports = Vue.component("comp-sort", {
    template: __inline("index.jade"),
    activate: function(ready){
        var _this = this;
        $("#main").waiting({fixed: true});

        comjs.ajaxGet(api.getMenuList, {appid: _this.appid}, function(json){
            console.log(json);
            if(json.code == 0){
                var menu = JSON.parse(json.data);
                if(menu.menu && menu.menu.button && menu.menu.button.length){
                    var mediaList,
                        media_ids;

                    var button = menu.menu.button;
                    _this.menu = button;
                    _this.edititem = button.length>0 ? button[0] : null;

                    _this.parentidx = 0;
                    _this.subidx = null;

                    media_ids = getMediaIds(button);
                    //console.log(media_ids);
                    comjs.ajaxGet(
                        api.getBatchMaterialInfo,
                        {
                            appid: comjs.getLocalItem("appid"),
                            reply_list_info: JSON.stringify(media_ids)
                        },
                        function(json){
                            console.log(json);
                            var medias = json.data;
                            mediaList = createMediaList(button, medias);
                            _this.medialist = mediaList;
                            _this.chkmedia = mediaList.length > 0 ? mediaList[0] : null;
                            console.log(_this.chkmedia);
                            $("#main").waiting("done");
                            ready();
                        }
                    );

                }


            }else{
                $("#main").waiting("done");
                ready();
            }

        });
    },
    ready: function(){
        var _this = this;
        //comjs.ajaxGet(api.getMenuList, {appid: this.appid}, function(json){
        //    console.log(json);
        //    if(json.code == 0){
        //        var data = JSON.parse(json.data);
        //        if(data != "不存在的菜单数据"){
        //            var button = data.menu.button;
        //            console.log(JSON.stringify(button));
        //            _this.menu = button;
        //            _this.edititem = button.length>0 ? button[0] : {};
        //        }
        //    }
        //
        //});

    },
    created: function(){

    },
    data: function(){
        return {
            sortable: 0,
            parentidx: 0,
            subidx: 0,
            reset: false,
            appid: comjs.getLocalItem("appid"),
            menu: [],
            edititem: {},
            medialist: [],
            chkmedia: {}
        }
    },

    methods: {
        ableSort: function(evt){
            if(!this.menu) return;
            var list1 = $("#menuList")[0];
            sort1 = new Sortable(list1, options);
            $(sort1.el).addClass("sort")
                .children()
                .removeClass("itemActive");
            this.sortable = !this.sortable;
            //console.log(sort1);
            $("#sortBtn").hide();
        },
        sortComplete: function(){
            var self = this;
            if(sort1.el){

                $(sort1.el).removeClass("sort");
                this.sortable = !this.sortable;
                sort1.destroy();
                //console.log(sort1);

                $("#sortBtn").show();

            }
        },
        showRes: function(){
            console.log(localStorage.getItem(sort1));
        },
        showDate: function(){
            alert(JSON.stringify(this.menu));
        },
        updateData: function(){
            $("#main").waiting({fixed: true});
            var _this = this;
            var status = true;
            //_this.menu.forEach(function(v){
            //    if(v.media_id != "") {
            //        toastr.error("请选择菜单的内容");
            //        status = false;
            //        break;
            //    }
            //});

            //for(var i = 0; i < _this.menu.length; i++) {
            //    if(_this.menu[i].media_id == "" || !_this.menu[i].media_id) {
            //        toastr.error("请选择菜单的内容");
            //        status = false;
            //        break;
            //    }
            //}

            if(status){
                var postDate = {
                    button: _this.menu
                }
                console.log(JSON.stringify(postDate));
                postDate = JSON.stringify(postDate);
                comjs.ajaxGet(
                    api.createMenu,
                    {appid: comjs.getLocalItem("appid"), content: postDate},
                    function(json){
                        console.log(json);
                        if(json.code == 0){
                            toastr.success("菜单保存成功");
                            $("#main").waiting("done");
                        }else{
                            toastr.error("菜单保存失败,请查看菜单内容是否已经填写");
                            $("#main").waiting("done");
                        }
                    }
                );
            }else{
                $("#main").waiting("done");
            }



        },
        addMenu: function(evt){
            evt.stopPropagation();
            var menuData = {  //定义新添加菜单数据对象
                name: "新菜单",
                sub_button: [],
                type: "view_limited"
            };
            var newMediaData = {
                type: "view_limited",
                data: null,
                sub_button: []
            };

            var self = this;
            self.menu.push(menuData);
            self.edititem = self.menu[self.menu.length-1];

            self.medialist.push(newMediaData);
            self.chkmedia = self.medialist[self.medialist.length-1];
        },
        addSubMenu: function(sublist, pid){
            //alert(pid);
            //return false;
            var self = this;
            var subMenuData = { //定义新添加子菜单数据对象
                name: "子菜单",
                type: "view_limited"
            };
            var newMediaData = {
                type: "view_limited",
                data: null
            };

            sublist.sub_button.push(subMenuData);
            self.edititem = sublist.sub_button[sublist.sub_button.length-1];


            self.medialist[pid].sub_button.push(newMediaData);
            self.chkmedia = self.medialist[pid].sub_button[self.medialist[pid].sub_button.length-1];
        },
        setItem: function(item, event){
            event.stopPropagation();
            var _this = this;
            _this.edititem = item;
            var _target = $(event.target);
            $(".itemActive").removeClass("itemActive");
            if(_target.hasClass("dragItem")){
                _target.addClass("itemActive selected")
                    .siblings()
                    .removeClass("selected");
                _this.parentidx = _target.data("parentidx");
                var _subidx = _target.data("subidx");
                if(_subidx == undefined){
                    _this.subidx = null;
                    _this.chkmedia = _this.medialist[_this.parentidx];
                }else{
                    _this.subidx = _subidx;
                    _this.chkmedia = _this.medialist[_this.parentidx]["sub_button"][_this.subidx];
                }
            }else{
                _target.parent().addClass("itemActive selected")
                    .siblings()
                    .removeClass("selected");
                _this.parentidx = _target.parent().data("parentidx");
                var _subidx = _target.parent().data("subidx");
                if(_subidx == undefined){
                    _this.chkmedia = _this.medialist[_this.parentidx];
                }else{
                    _this.subidx = _subidx;
                    _this.chkmedia = _this.medialist[_this.parentidx]["sub_button"][_this.subidx];
                }
            }
            console.log(_this.chkmedia);
            _this.reset = false;
            //console.log(JSON.stringify(this.edititem));
        }

    }
});


function getMediaIds(button, mids){
    var media_ids = mids || [];
    button.forEach(function(v, k){
        if(v.type != undefined && (v.type == "media_id" || v.type == "view_limited")) {
            media_ids.push({type: v.type == "media_id" ? "img" : v.type, content: v.media_id});
        }
        if(v.sub_button.length > 0) getMediaIds(v.sub_button, media_ids);

    });

    return media_ids;
}

function createMediaList(button, medias){
    console.log(medias);
    var media_arr = [];
    var idx = 0;
    button.forEach(function(v, k){
        if(v.sub_button.length > 0){
            var subs = [];
            v.sub_button.forEach(function(sv, sk){
                if(sv.type == "media_id"){
                    subs.push({
                        //name: sv.name,
                        type: sv.type,
                        data: medias[idx] != null ? medias[idx].local_url : null
                    });
                    idx ++;
                }else if(sv.type == "view_limited"){
                    subs.push({
                        //name: sv.name,
                        type: sv.type,
                        data: medias[idx] != null ? JSON.parse(medias[idx]) : null
                    });
                    idx ++;
                }else{
                    subs.push({
                        //name: sv.name,
                        type: sv.type,
                        data: null
                    });
                    idx ++;

                }
            });
            media_arr.push({
                //name: v.name,
                data: null,
                sub_button: subs
            });
        }else{
            if(v.type == "media_id"){
                media_arr.push({
                    //name: v.name,
                    type: v.type,
                    data: medias[idx] != null ? medias[idx].local_url : null,
                    sub_button: []
                });
                idx ++;

            }else if(v.type == "view_limited"){
                media_arr.push({
                    //name: v.name,
                    type: v.type,
                    data: medias[idx] != null ? JSON.parse(medias[idx]) : null,
                    sub_button: []
                });
                idx ++;

            }else{
                media_arr.push({
                    //name: v.name,
                    type: v.type,
                    data: null,
                    sub_button: []
                });
                idx ++;

            }

        }

    });
    return media_arr;
}


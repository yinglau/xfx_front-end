var $ = require("jquery"),
    _ = require("underscore"),
    Vue = require("vue");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");

require("widgets/pagebar/pager");

//组件
require("plugin/popmodal/popmodal");
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

module.exports = Vue.component("fans-box", {
    template: __inline("index.jade"),
    activate: function(ready){
        var _this = this;
        $("#main").waiting({fixed: true});

        comjs.ajaxGet(
            api.getUserGroup,
            {appid: comjs.getLocalItem("appid")},
            function (json) {
                console.log(json)
                //{"groups":[{"id":0,"name":"未分组","count":26}
                if (json.code == 0) {
                    var data = JSON.parse(json.data);

                    if(data.groups.length) _this.grouplist = data.groups;

                }
            }
        );

        comjs.ajaxGet(
            api.getUserList,
            {appid: comjs.getLocalItem("appid"), },
            function (json) {
                if(json.code == 0){
                    console.log(json.data);
                    var data = JSON.parse(json.data);
                    var _userlist = JSON.parse(data.list);

                    _userlist = buildNewUserList(_userlist);
                    _this.userlist = _userlist;
                    _this.usercount = data.totalRow;

                    _this.pageInfo = comjs.buildPageInfo(data, "getUserListForPage");

                    $("#main").waiting("done");
                    ready();

                }
            }
        );



    },
    ready: function(){
        var _this = this;
        $(document).on("click", "#groupInputs .js_selecteGroup", function(){
            var $this = $(this);
            var checkLength = $("#groupInputs .js_selecteGroup:checked").length;
            //alert(checkLength);
            if(checkLength>3) return false;
            if($this.is(":checked")){
                _this.selecteGroup.push({group_id: $this.val(), group_name: $this.data("gname")});
            }else{
                var idx = checkValInArr.apply(_this, [$this.val()]);
                if(idx >= 0)_this.selecteGroup.splice(idx, 1);
            }
            console.log(_this.selecteGroup);
        });
    },
    data: function(){
        return {

            userlist: [],
            usercount: "",
            grouplist: [],

            chkAllItem: false,
            chkItemInput: [],
            selecteGroup: [],
            groupTit: "全部用户",
            groupSign: null,
            groupIdx: null,

            pageInfo: {}
        }
    },
    watch: {
      "chkAllItem": function(val, oldval){
          var _this = this;
          if(val){
              var arr = [];
              var $input = $(".js_checkedUser");
              $input.each(function(k, v){
                  var $this = $(this);
                  _this.chkItemInput.push($this.val());
              });
              //console.log(_this.chkItemInput);
          }else{
              _this.$set("chkItemInput", []);
          }
      }
    },
    methods: {
        reGroupName: function(evt){
            var _this = this;
            var $target = $(evt.target),
                egsign = $target.data("egsign");
            $("[data-egsign="+egsign+"]").popModal({
                html : __inline("plugin/popmodal/templates/regroupname.jade"),
                placement : 'bottomLeft',
                showCloseBut : true,
                onDocumentClickClose : true,
                onOkBut : function(){
                    var $input = $("#gNameInput"),
                        val = $input.val();
                    if(!val.length){
                        $input.css("border", "1px solid red");
                        return false;
                    };
                    comjs.ajaxGet(
                        api.modifyGroupName,
                        {appid: comjs.getLocalItem("appid"), name: val, id: egsign},
                        function(json){
                            if(json.code == 0) toastr.success("标签修改成功");
                            _this.grouplist[_this.groupIdx].name = val;
                            _this.$set("groupTit", val);
                        }
                    );
                },
                onCancelBut : function(){ },
                onLoad : function(){ },
                onClose : function(){ }
            });
        },
        getUserListForPage: function(page){
            $("#main").waiting({fixed: true});
            var _this = this;

            var ajaxUrl;

            if(_this.groupSign==null){
                ajaxUrl = api.getUserList;
            }else{
                ajaxUrl = api.getUserlistByGroupId;
            }

            comjs.ajaxGet(
                ajaxUrl,
                {appid: comjs.getLocalItem("appid"), group_id: _this.groupSign, pageNum: page},
                function(json){
                    console.log(json);
                    if(json.code == 0) {
                        var data = JSON.parse(json.data);
                        var _userlist = JSON.parse(data.list);
                        _userlist = buildNewUserList(_userlist);
                        _this.$set("userlist", _userlist);
                        _this.pageInfo = comjs.buildPageInfo(data, "getUserListForPage");

                        $("#main").waiting("done");
                    }

                }
            )
        },
        getUserList: function(evt){
            $("#main").waiting({fixed: true});
            var _this = this;
            var $target = $(evt.target);
            var item = $target.data("gitem");
            var idx = $target.data("gidx");
            setGroupInfo.apply(_this, [item, idx]);
            comjs.ajaxGet(
                api.getUserlistByGroupId,
                {appid: comjs.getLocalItem("appid"), group_id: item.id},
                function(json){
                    console.log(json);
                    if(json.code == 0) {
                        var data = JSON.parse(json.data);
                        var _userlist = JSON.parse(data.list);
                        _userlist = buildNewUserList(_userlist);
                        _this.$set("userlist", _userlist);
                        _this.pageInfo = comjs.buildPageInfo(data, "getUserListForPage");
                        $("#main").waiting("done");
                    }

                }
            )
        },
        getAllUserList: function(){
            var _this = this;
            $("#main").waiting({fixed: true});
            setGroupInfo.apply(_this);
            comjs.ajaxGet(
                api.getUserList,
                {appid: comjs.getLocalItem("appid") },
                function (json) {
                    var data = JSON.parse(json.data);
                    var _userlist = JSON.parse(data.list);
                    _userlist = buildNewUserList(_userlist);
                    _this.$set("userlist", _userlist);
                    _this.pageInfo = comjs.buildPageInfo(data, "getUserListForPage");
                    $("#main").waiting("done");
                }
            );
        },
        getGroupList: function(){
            var _this = this;
            comjs.ajaxGet(
                api.getUserGroup,
                {appid: comjs.getLocalItem("appid")},
                function (json) {
                    //console.log(json)
                    if (json.code == 0) {
                        var data = json.data;
                        _this.grouplist = data;
                    }
                }
            );
        },
        editNickName: function(evt){ //修改用户备注名
            var _this = this;
            evt.stopPropagation();
            var $target = $(evt.target);
            var openid = $target.data("openid");
            var idx = $target.data("idx");
            $("[data-openid="+ openid +"]").popModal({  //这里的选择器最好不要使用class, id,不然addkeywords模板里面的input获取的值为空,未知原因
                html : __inline("plugin/popmodal/templates/editremark.jade"),
                placement : 'bottomRight',
                showCloseBut : true,
                onDocumentClickClose : true,
                onOkBut : function(){
                    var $input = $("#remarkinput"),
                        val = $input.val();
                    if(!val.length){
                        $input.css("border", "1px solid red");
                        return false;
                    };
                    comjs.ajaxGet(
                        api.updateRemark,
                        {appid: comjs.getLocalItem("appid"), user_remark: val, user_openid: openid},
                        function(json){
                            if(json.code == 0) toastr.success("备注修改成功");
                            _this.userlist[idx].user_remark = val;
                        }
                    );

                },
                onCancelBut : function(){ },
                onLoad : function(){ },
                onClose : function(){ }
            });
        },
        delGroup: function(evt){
            var _this = this;
            console.log(_this.grouplist[_this.groupIdx])
            var $target = $(evt.target);
            var dgsign = $target.data("dgsign");
            $("[data-dgsign="+dgsign+"]").popModal({
                html : __inline("plugin/popmodal/templates/delGroup.jade"),
                placement : 'bottomCenter',
                showCloseBut : true,
                onDocumentClickClose : true,
                onOkBut : function(){
                    comjs.ajaxGet(
                        api.delGroup,
                        {appid: comjs.getLocalItem("appid"), id: dgsign},
                        function(json){
                            console.log(json)
                            if(json.code == 0) toastr.success("标签修改成功");
                            _this.grouplist.$remove(_this.grouplist[_this.groupIdx]);
                            setGroupInfo.apply(_this);
                            _this.getAllUserList();
                            //_this.$set("groupTit", "全部用户");
                            //_this.$set("groupSign", 0);
                            //_this.$set("groupIdx", 0);
                        }
                    );

                },
                onCancelBut : function(){ },
                onLoad : function(){ },
                onClose : function(){ }
            });
        },
        addGroup: function(evt){ //添加分组
            var _this = this;
            evt.stopPropagation();
            $("[data-ele=addgroup]").popModal({  //这里的选择器最好不要使用class, id,不然addkeywords模板里面的input获取的值为空,未知原因
                html : __inline("plugin/popmodal/templates/addkeywords.jade"),
                placement : 'bottomRight',
                showCloseBut : true,
                onDocumentClickClose : true,
                onOkBut : function(){
                    var $input = $("#keyinput"),
                        val = $input.val();
                    if(!val.length){
                        $input.css("border", "1px solid red");
                        return false;
                    };
                    comjs.ajaxGet(
                        api.createUserGroup,
                        {appid: comjs.getLocalItem("appid"), name: val, username: comjs.getLocalItem("username")},
                        function(json){
                            console.log(json);
                            if(json.code == 0){
                                var data = json.data.group;
                                var _grouplist = {};
                                _grouplist.user_count = 0;
                                _grouplist.name = data.name;
                                _grouplist.id = data.id;
                                _grouplist.count = 0;
                                _this.grouplist.push(_grouplist);
                                toastr.success("添加分组成功");
                            }
                        }
                    );
                },
                onCancelBut : function(){ },
                onLoad : function(){ },
                onClose : function(){ }
            });
        },
        checkAllUser: function(evt){

            var _this = this;
            _this.chkAllItem = !_this.chkAllItem;

        },
        singleUserAddToGroup: function(evt){
            var _this = this;
            var $target = $(evt.target);
            var uid = $target.data("uid");
            var uidx = $target.data("uidx");
            var gElement = $("[data-target=a"+ uidx +"]");

            var _ugids = []; //已加入的分组ID
            var _ugnames = []; //已加入分组的名称

            gElement.each(function(k, v){
                _ugids.push($(v).data("ugid"));
                _ugnames.push($(v).data("ugname"));

            });

            _this.selecteGroup = [];
            if(_ugids.length > 0){
                _ugids.forEach(function(v, k){
                    _this.selecteGroup.push({
                        group_id: v,
                        group_name: _ugnames[k]
                    });
                });
            }
            console.log(_this.selecteGroup);
            var tempData = {
                groupList: _this.grouplist,
                ugids: _ugids
            }



            var temp = _.template(__inline("plugin/popmodal/templates/addtogroup.jade"));
            $("[data-uid="+uid+"]").popModal({  //这里的选择器最好不要使用class, id,不然addkeywords模板里面的input获取的值为空,未知原因
                html : temp(tempData),
                placement : 'bottomCenter',
                showCloseBut : true,
                onDocumentClickClose : true,
                onOkBut : function(){
                    var checkLength = $("#groupInputs .js_selecteGroup:checked").length;
                    //if(!checkLength) return false;
                    var gids = [];
                    var inGroupData = [];
                    _this.selecteGroup.forEach(function(v){
                        //_this.userlist[uidx].group_namelist.push(v);
                        gids.push(v.group_id);
                        inGroupData.push({group_id: v.group_id, group_name: JSON.stringify(v.group_name)});
                    });

                    //gids = _.union(gids, ugids);
                    gids = gids.join(",");
                    console.log(_this.selecteGroup);
                    console.log(gids);
                    //return false;
                    comjs.ajaxGet(
                        api.moveUserToGroup,
                        {
                            appid: comjs.getLocalItem("appid"),
                            id: gids,
                            user_openid: uid
                        },
                        function(json){
                            console.log(json);
                            if(json.code == 0){
                                toastr.success("移动分组成功");
                                //$target.data("ugids", gids);
                                //$target.attr("data-ugids", gids);
                                console.log(_this.selecteGroup)
                                _this.userlist[uidx].group_namelist = inGroupData;
                                resetGroupList.apply(_this);

                            }
                        }
                    )
                },
                onCancelBut : function(){
                    //_this.chkItemInput
                    _this.$set("selecteGroup", []);
                },
                onLoad : function(){ },
                onClose : function(){
                    _this.$set("selecteGroup", []);
                }
            });
        },
        addToGroup: function(){
            var _this = this;
            var temp = _.template(__inline("plugin/popmodal/templates/addtogroup.jade"));
            $("[data-ele=addToGroup]").popModal({  //这里的选择器最好不要使用class, id,不然addkeywords模板里面的input获取的值为空,未知原因
                html : temp(_this.grouplist),
                placement : 'bottomLeft',
                showCloseBut : true,
                onDocumentClickClose : true,
                onOkBut : function(){

                },
                onCancelBut : function(){
                    //_this.chkItemInput
                    _this.$set("selecteGroup", []);
                },
                onLoad : function(){ },
                onClose : function(){
                    _this.$set("selecteGroup", []);
                }
            });
        }
    }
});

function checkVal(value, $ele){
    if(!value||!value.length) {
        //toastr.warning("请填写分组名称");
        return false;
    }
    return true;
}

function checkValInArr(val){
    var _this = this;
    var idx;
    _this.selecteGroup.forEach(function(v, k){

        if(v.group_id == val) {
            idx = k;
            return;
        }

    });
    return idx;

}


function buildNewUserList(arr){
    arr.forEach(function(v){
        if(!v.user_remark) v.user_remark = "";
        if(!v.user_groupid) v.user_groupid = "";
    });
    return arr;
}

function setGroupInfo(item, idx){
    var _this = this;
    _this.$set("groupTit", item ? item.name : "全部用户");
    _this.$set("groupSign", item ? item.id : null);
    _this.$set("groupIdx", idx || null);
}

function resetGroupList(){
    var _this = this;
    comjs.ajaxGet(
        api.getUserGroup,
        {appid: comjs.getLocalItem("appid")},
        function (json) {
            console.log(json)
            //{"groups":[{"id":0,"name":"未分组","count":26}
            if (json.code == 0) {
                var data = JSON.parse(json.data);

                if(data.groups.length) _this.grouplist = data.groups;

            }
        }
    );
}
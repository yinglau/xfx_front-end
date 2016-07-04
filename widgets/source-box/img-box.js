var $ = require("jquery"),
    Vue = require("vue");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");

require("plugin/popmodal/popmodal");
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


module.exports = Vue.component("img-box", {
    template: __inline("img-box.jade"),
    ready: function(){
        var _this = this;

        comjs.ajaxGet(
            api.getMedialist,
            {appid: _this.appid, username: _this.username, pageNum: 0, pageSize: 10, mediaType: "image"},
            function(json){
                if(json.code == 0){
                    console.log(json.data);
                    _this.imgList = json.data.list;
                }
            }
        );
    },
    data: function(){
        return {
            appid: comjs.getLocalItem("appid"),
            username: comjs.getLocalItem("username"),
            imgList: [],
            chkAllItem: false,
            chkItemInput: []
        }
    },
    watch: {
        "chkAllItem": function(val, oldval){
            var _this = this;
            if(val){
                var arr = [];
                var $input = $(".js_checkImgItem");
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

        editSource: function(evt){
            var $target = $(evt.target);
            var sign = $target.data("editkey")
            $("[data-editkey="+sign+"]").popModal({
                html : __inline("plugin/popmodal/templates/editSourceName.jade"),
                placement : 'bottomCenter',
                showCloseBut : true,
                onDocumentClickClose : true,
                onOkBut : function(){
                    var $input = $("body").find("#keyinput"), //$("#keyinput"),
                        value = $input.val();
                    if(!checkVal(value, $input)) return false;

                },
                onCancelBut : function(){ },
                onLoad : function(){ },
                onClose : function(){ }
            });
        },
        delMulItem: function(){
            var _this = this;
            $("[data-delitem=check]").popModal({
                html : __inline("plugin/popmodal/templates/sureDel.jade"),
                placement : 'bottomCenter',
                showCloseBut : true,
                onDocumentClickClose : true,
                onOkBut : function(){
                    delMulItem.apply(_this, []);
                },
                onCancelBut : function(){ },
                onLoad : function(){ },
                onClose : function(){ }
            });



        },
        delMediaItem: function(item, evt){
            var _this = this;
            var $target = $(evt.target);
            var delkey = $target.data("delkey");
            $("[data-delkey="+delkey+"]").popModal({
                html : __inline("plugin/popmodal/templates/sureDel.jade"),
                placement : 'bottomLeft',
                showCloseBut : true,
                onDocumentClickClose : true,
                onOkBut : function(){
                    comjs.ajaxGet(
                        api.delMedias,
                        {
                            appid: comjs.getLocalItem("appid"),
                            username: comjs.getLocalItem("username"),
                            mediaType: "image",
                            media_ids: delkey
                        },
                        function(json){
                            console.log(json)
                            if(json.code == 0) {
                                toastr.success("图片删除成功");
                                _this.imgList.$remove(item);
                            }else{
                                toastr.warning("图片正在使用,不能删除");
                            }
                        }
                    )
                },
                onCancelBut : function(){ },
                onLoad : function(){ },
                onClose : function(){ }
            });
        }
    }
});

function checkVal(value, $ele){
    if(!value||!value.length) {
        $ele.css("border", "1px solid red");
        return false;
    }
    return true;
}

function delMulItem(){
    var _this = this;
    var $js_check = $(".js_checkImgItem:checked");
    if(!$js_check.length){
        toastr.warning("请勾选要删除的项目");
        return false;
    }

    var media_ids = _this.chkItemInput.join(",");
    comjs.ajaxGet(
        api.delMedias,
        {
            appid: comjs.getLocalItem("appid"),
            username: comjs.getLocalItem("username"),
            mediaType: "image",
            media_ids: media_ids
        },
        function(json){
            if(json.code == 0) {
                toastr.success("图片删除成功");
                setTimeout(function(){
                    location.reload();
                }, 1000)

                //_this.newsList.$remove(item);
            }else{
                toastr.warning("图片正在使用,不能删除");
            }
        }
    );
}
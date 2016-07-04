var $ = require("jquery"),
    _ = require("underscore"),
    Vue = require("vue");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");

//plugin
require("plugin/confirm/index");
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


module.exports = Vue.component("rule-box", {
    template: __inline("rule.jade"),
    activate: function(ready){
        var _this = this;
        $('#main').waiting({ fixed: true });
        setTimeout(function(){
            comjs.ajaxGet(
                api.getReplyInfo,
                {
                    appid: comjs.getLocalItem("appid"),
                    category_type: "key_word"
                },
                function(json){
                    console.log(JSON.stringify(json.data));
                    if(json.code == "0"){
                        var data = json.data;
                        data.forEach(function(v, k){
                            //v.keyword_list_info = v.keyword_list_info.split(",");
                            v.reply_list_info = JSON.parse(v.reply_list_info);
                        });
                        _this.rules = data;
                        $('#main').waiting("done");
                        ready();
                    }
                }
            );
        }, 3000)
    },
    ready: function(){

        $(document).on("click", ".ruleItemHead", function(){
            var $this = $(this),
                $parent = $this.parent();
            $parent.toggleClass("open");
        });
        $(document).on("input", "#keyinput", function(){
            var $this = $(this);
            $this.css("border", "1px solid #e7e7eb");
        });


    },
    props: ["rules"],
    methods: {
        showConfirm: function(type, act, sign){
            var temp,
                _this = this;

            if(_this.rules[sign[0]].reply_list_info.length >= 5){
                toastr.warning("只能设置5条回复");
                return false;
            }

            var data;
            act = act ? act : "add";

            switch(type){
                case "news":
                    temp = _.template(__inline("plugin/confirm/templates/appmsg.jade"));

                    break;
                case "image":
                    temp = _.template(__inline("plugin/confirm/templates/apppic.jade"));

                    break;
                case "voice":
                    temp = _.template(__inline("plugin/confirm/templates/appaudio.jade"));

                    break;
                case "video":
                    temp = _.template(__inline("plugin/confirm/templates/appvideo.jade"));

                    break;
                case "text":
                    temp = _.template(__inline("plugin/confirm/templates/apptext.jade"));
                    if(sign.length>1&&sign[1]!=null) data = _this.rules[sign[0]].reply_list_info[sign[1]];
                    break;
            }

            if(type == "text") {
                openTextBox.apply(_this, [temp, act, sign, data]);
            }else{
                openMediaBox.apply(_this, [temp, act, sign, type]);
            }


        },
        addRules: function(){
            var _this = this;
            var dataObj =
                {
                    "reply_list_info": [],
                    "create_time": "",
                    "rule_name": "新规则",
                    "from_wx": false,
                    "content_text": "",
                    "category_type": "key_word",
                    "is_add_friend_reply_open": 0,
                    "content_type": "",
                    "is_autoreply_open": 0,
                    "keyword_list_info": [],
                    "reply_mode": "random_one",
                    "id": 0,
                    "app_id": comjs.getLocalItem("appid"),
                    "status": false
                }
            _this.rules.unshift(dataObj);
            $(".ruleListItem").removeClass("open");
        },
        addKeyWords: function(evt){
            var $this = $(evt.target),
                comp = this,
                key = $this.data("key");
            //alert(key);
            $("[data-key="+key+"]").popModal({
                html : __inline("plugin/popmodal/templates/addkeywords.jade"),
                placement : 'bottomLeft',
                showCloseBut : true,
                onDocumentClickClose : true,
                onOkBut : function(){
                    var $input = $("#keyinput"),
                        value = $input.val();
                    if(!checkVal(value, $input)) return false;
                    var keyword = comp.rules[key].keyword_list_info;
                    if(comp.rules[key].keyword_list_info!=""){
                        comp.rules[key].keyword_list_info += "," + $("#keyinput").val();
                    }else{
                        comp.rules[key].keyword_list_info += $("#keyinput").val();
                    }
                    //comp.rules[key].keyword_list_info.push($("#keyinput").val());
                    console.log(comp.rules[key].keyword_list_info);
                },
                onCancelBut : function(){ },
                onLoad : function(){ },
                onClose : function(){ }
            });
        },
        editKeyWord: function(evt){
            var $this = $(evt.target),
                comp = this,
                sign = $this.data("esign");
            sign = sign.split(",");

            $("[data-sign='editkey"+sign[0]+sign[1]+"']").popModal({
                html : __inline("plugin/popmodal/templates/addkeywords.jade"),
                placement : 'bottomLeft',
                showCloseBut : true,
                onDocumentClickClose : true,
                onOkBut : function(){
                    var $input = $("#keyinput"),
                        val = $input.val();
                    if(!val.length){
                        $input.css("border", "1px solid red");
                        return false;
                    };
                    comp.rules[sign[0]].keyword_list_info.$set(sign[1], val);
                },
                onCancelBut : function(){ },
                onLoad : function(){ },
                onClose : function(){ }
            });
        },
        delKeyWord: function(evt){
            var $this = $(evt.target),
                comp = this,
                sign = $this.data("dsign");
            sign = sign.split(",");
            var keywords = comp.rules[sign[0]].keyword_list_info.split(",");
            keywords.splice(sign[1], 1);
            keywords = keywords.join(",");
            //comp.rules[sign[0]].keyword_list_info.$remove(comp.rules[sign[0]].keyword_list_info[sign[1]]);
            comp.rules[sign[0]].keyword_list_info = keywords;
        },
        saveRules: function(data){
            //alert(JSON.stringify(json));
            comjs.ajaxGet(
                api.saveReplyRule,
                {
                    appid: comjs.getLocalItem("appid"),
                    id: data.id,
                    data: JSON.stringify(data)
                },
                function(json){
                    console.log(json);
                    if(json.code == 0){
                        if(data.id != 0){
                            toastr.success("规则保存成功");
                        }else{
                            toastr.success("规则添加成功");
                        }
                    }
                }
            )
        },
        delRule: function(item){
            var comp = this;
            var columnClass, defaultColumnClass = "col-md-10 col-md-offset-1";
            var temp = _.template(__inline("plugin/confirm/templates/infotips.jade"));

            $.confirm({
                title: false,
                content: temp({tipstr: "是否确定删除规则"}),
                columnClass: columnClass || defaultColumnClass,
                confirmButtonClass: 'btn-info',
                cancelButtonClass: 'btn-danger',
                confirmButton: "确定",
                cancelButton: "取消",
                animation: "opacity",
                backgroundDismiss: true,
                confirm: function(){
                    comjs.ajaxGet(
                        api.delAutoRelyMsg,
                        {
                            appid: comjs.getLocalItem("appid"),
                            id: item.id
                        },
                        function(json){
                            console.log(json);
                            if(json.code == 0) {
                                toastr.success("规则删除成功");
                                comp.rules.$remove(item);
                            }
                        }
                    );
                },
                cancel: function(){

                }
            });

        },
        delReply: function(act){
            var comp = this;
            comp.rules[act[0]].reply_list_info.$remove(act[1]);
        }
    },
    filters: {
        countReply: function(json, type){
            //json = JSON.parse(json);
            var count = 0;
            if(json.length == 0) return count;
            json.forEach(function(item){
                if(type){
                    if(item.type == type) count++;
                }else{
                    count++;
                }

            });
            return count;
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

function openTextBox(temp, act, sign, data){
    var _this = this;
    $.confirm({
        title: false,
        content: temp(data),
        columnClass: 'col-md-10 col-md-offset-1',
        confirmButtonClass: 'btn-info',
        cancelButtonClass: 'btn-danger',
        confirmButton: "确定",
        cancelButton: "取消",
        animation: "opacity",
        backgroundDismiss: true,
        confirm: function(){
            if(act == "add"){
                var dataObj = {
                    type: "text",
                    content: $("#textContent").val()
                }
                _this.rules[sign[0]].reply_list_info.push(dataObj);
            }else{
                var val = $("#textContent").val();
                _this.rules[sign[0]].reply_list_info[sign[1]].content = val;
            }

        },
        cancel: function(){

        }
    });
}

function openMediaBox(temp, act, sign, type){
    var _this = this;


    var columnClass, defaultColumnClass = "col-md-10 col-md-offset-1";
    var ajaxApi = api.getMedialist;
    comjs.ajaxGet(
        ajaxApi,
        {appid: comjs.getLocalItem("appid"), username: comjs.getLocalItem("username"), pageNum: 0, pageSize: 5, mediaType: type},
        function(json){
            var data = JSON.parse(json.data);
            console.log(data.item);
            $.confirm({
                title: false,
                content: temp(data.item),
                columnClass: columnClass || defaultColumnClass,
                confirmButtonClass: 'btn-info',
                cancelButtonClass: 'btn-danger',
                confirmButton: "确定",
                cancelButton: "取消",
                animation: "opacity",
                backgroundDismiss: true,
                confirm: function(){
                    if(act == "add"){
                        switch(type){

                            case "news":
                                var res = $("#dataList li.selected").find("#dataDiv").data("res");
                                console.log(res);
                                var newsData = {
                                    news_info: {
                                        list: [
                                            {
                                                cover_url: res.content.news_item[0].thumb_url,
                                                show_cover: res.content.news_item[0].show_cover_pic,
                                                author: res.content.news_item[0].author,
                                                digest: res.content.news_item[0].digest,
                                                content_url: res.content.news_item[0].url,
                                                title: res.content.news_item[0].title,
                                                source_url: res.content.news_item[0].content_source_url
                                            }
                                        ]
                                    },
                                    type: "news",
                                    content: res.media_id
                                }
                                _this.rules[sign[0]].reply_list_info.push(newsData);
                                break;
                            case "image":
                                var mediaId = $("#dataList li.selected").find("#mediaId").html();
                                var imageData = {
                                    "type": "img",
                                    "content": mediaId
                                }
                                _this.rules[sign[0]].reply_list_info.push(imageData);
                                break;
                        }

                    }else{
                        switch(type){

                        }
                    }

                },
                cancel: function(){

                }
            });
        }
    );
}
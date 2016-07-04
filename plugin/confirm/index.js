var $ = require("jquery");

require("jquery-confirm");

$(document).on("input propertychange", ".editContent", statInputNum);
$(document).on("click", ".infoList li, .picItem", msgActive);
$(document).on("click", ".urlTabItem", showUrlBlock);

function statInputNum(){
    var $editor = $(this),
        $parent = $editor.parent(),
        $wordNum = $parent.find("#wordNum"),
        $wordCount = $parent.find("#wordCount"),
        wordCount = $wordCount.text();
    $editor.attr("maxlength", wordCount);
    var wordNum = $editor.val().length;
    $wordNum.html(wordCount-wordNum);

}

function msgActive(){
    var _this = $(this);
    _this.addClass("selected")
        .siblings()
        .removeClass("selected")
}

function showUrlBlock(){
    var $this = $(this),
        itemIdx = $this.index();
    $this.addClass("selected")
        .siblings()
        .removeClass("selected");
    $(".urlBlockItem").eq(itemIdx)
        .addClass("selected")
        .siblings()
        .removeClass("selected");
}
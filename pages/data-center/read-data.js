var $ = require("jquery"),
    Vue = require("vue");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");

//require("widgets/appinfo/applist");
var echarts = require("plugin/chart/echart");


require("widgets/appinfo/applist");


var app = new Vue({
    el: "#main",
    ready: function() {
        var _this = this;

        comjs.ajaxGet(
            api.getArticleAnalysisData,
            {appid: comjs.getLocalItem("appid")},
            function(json){

                if(json.code == 0){
                    var category = [];
                    var cumulate_user = [],
                        sum_new_user = [],
                        sum_cancel_user = [];
                    if(json.data.length > 0) {
                        _this.data = json.data;

                        var dom = $("#chart")[0];
                        var myChart = echarts.init(dom);

                        json.data.forEach(function(v){
                            category.push(v.create_date);
                            cumulate_user.push(v.cumulate_user);
                            sum_new_user.push(v.sum_new_user);
                            sum_cancel_user.push(v.sum_cancel_user);

                        });

                        // 指定图表的配置项和数据
                        var option = {

                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['头条阅读数', '头条点赞数', '二条阅读数', '二条点赞数']
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: category
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [
                                {
                                    name:'粉丝总数',
                                    type:'line',
                                    stack: '总量',
                                    data: cumulate_user
                                },
                                {
                                    name:'新增粉丝数',
                                    type:'line',
                                    //stack: '总量',
                                    data: sum_new_user
                                },
                                {
                                    name:'取消关注数',
                                    type:'line',
                                    //stack: '总量',
                                    data: sum_cancel_user
                                }

                            ]
                        };

                        // 使用刚指定的配置项和数据显示图表。
                        myChart.setOption(option);


                    }

                }

            }
        );
    },
    data: {
        isChkApp: comjs.isChkApp(),
        data: []
    }
});
var $ = require("jquery"),
    Vue = require("vue");

var comjs = require("/pages/common/glob"),
    api = require("/pages/common/interface");


require("widgets/appinfo/applist");

//require("widgets/appinfo/applist");
var echarts = require("plugin/chart/echart");


var app = new Vue({
    el: "#main",
    ready: function() {
        var _this = this;

        comjs.ajaxGet(
            api.getXfxUserAdd,
            {appid: comjs.getLocalItem("appid"), date: "2016-05-11"},
            function(json){

                if(json.code == 0){
                    var category = [];
                    var yData = [];
                    if(json.data.length > 0) {
                        _this.data = json.data;

                        var dom = $("#chart")[0];
                        var myChart = echarts.init(dom);

                        json.data.forEach(function(v){
                            category.push(v.hour);
                            yData.push(v.count);

                        });

                        // 指定图表的配置项和数据
                        var option = {
                            title: {
                                text: '效果追踪'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['每小时粉丝统计']
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: true,
                                data: category
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [
                                {
                                    name:'粉丝总数',
                                    type:'bar',
                                    data: yData
                                },
                                {
                                    name:'粉丝总数',
                                    type:'line',
                                    data: yData
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
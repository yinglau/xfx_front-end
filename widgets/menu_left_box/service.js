//var json =  {
//    menu: [
//            {
//                mid: 1,
//                name: "菜单1",
//                type: 1,
//                content: "",
//                sub_buttons: [
//                    {
//                        mid: 2,
//                        name: "子菜单1",
//                        type: 1,
//                        content: "aaa"
//                    },
//                    {
//                        mid: 3,
//                        name: "子菜单2",
//                        type: 2,
//                        content: "bbb"
//                    },
//                    {
//                        mid: 4,
//                        name: "子菜单3",
//                        type: 1,
//                        content: "bbb"
//                    },
//                    {
//                        mid: 11,
//                        name: "子菜单2",
//                        type: 2,
//                        content: "bbb"
//                    },
//                    {
//                        mid: 12,
//                        name: "子菜单3",
//                        type: 1,
//                        content: "bbb"
//                    }
//                ]
//            },
//        {
//            mid: 5,
//            name: "菜单2",
//            type: 1,
//            content: "",
//            sub_buttons: [
//                {
//                    mid: 6,
//                    name: "子菜单1",
//                    type: 1,
//                    content: "aaa"
//                }
//            ]
//        }
//        ]
//}

var json = {
    "succeed":true,
    "errorCode":null,
    "json": {
        "is_menu_open": 1,
        "selfmenu_info": {
            "button": [
                {
                    "name": "button",
                    "sub_button": {
                        "list": [
                            {
                                "type": "view",
                                "name": "view_url",
                                "url": "http://www.qq.com"
                            },
                            {
                                "type": "news",
                                "name": "news",
                                "value":"KQb_w_Tiz-nSdVLoTV35Psmty8hGBulGhEdbb9SKs-o",
                                "news_info": {
                                    "list": [
                                        {
                                            "title": "MULTI_NEWS",
                                            "author": "JIMZHENG",
                                            "digest": "text",
                                            "show_cover": 0,
                                            "cover_url": "http://mmbiz.qpic.cn/mmbiz/GE7et87vE9vicuCibqXsX9GPPLuEtBfXfK0HKuBIa1A1cypS0uY1wickv70iaY1gf3I1DTszuJoS3lAVLvhTcm9sDA/0",
                                            "content_url": "http://mp.weixin.qq.com/s?__biz=MjM5ODUwNTM3Ng==&mid=204013432&idx=1&sn=80ce6d9abcb832237bf86c87e50fda15#rd",
                                            "source_url": ""
                                        },
                                        {
                                            "title": "MULTI_NEWS1",
                                            "author": "JIMZHENG",
                                            "digest": "MULTI_NEWS1",
                                            "show_cover": 1,
                                            "cover_url": "http://mmbiz.qpic.cn/mmbiz/GE7et87vE9vicuCibqXsX9GPPLuEtBfXfKnmnpXYgWmQD5gXUrEApIYBCgvh2yHsu3ic3anDUGtUCHwjiaEC5bicd7A/0",
                                            "content_url": "http://mp.weixin.qq.com/s?__biz=MjM5ODUwNTM3Ng==&mid=204013432&idx=2&sn=8226843afb14ecdecb08d9ce46bc1d37#rd",
                                            "source_url": ""
                                        }
                                    ]
                                }
                            },
                            {
                                "type": "video",
                                "name": "video",
                                "value": "http://61.182.130.30/vweixinp.tc.qq.com/1007_114bcede9a2244eeb5ab7f76d951df5f.f10.mp4?vkey=77A42D0C2015FBB0A3653D29C571B5F4BBF1D243FBEF17F09C24FF1F2F22E30881BD350E360BC53F&sha=0&save=1"
                            },
                            {
                                "type": "voice",
                                "name": "voice",
                                "value": "nTXe3aghlQ4XYHa0AQPWiQQbFW9RVtaYTLPC1PCQx11qc9UB6CiUPFjdkeEtJicn"
                            }
                        ]
                    }
                },

                {
                    "type": "img",
                    "name": "photo",
                    "value": "ax5Whs5dsoomJLEppAvftBUuH7CgXCZGFbFJifmbUjnQk_ierMHY99Y5d2Cv14RD",
                    "sub_button": {
                        "list": []
                    }
                }
            ]
        }
    },
    "accessTokenInvalid":false,
    "errorMsg":null
}
module.exports = json;
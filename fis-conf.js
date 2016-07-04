//打包配置
fis.match('::package', {  //打包载入资源配置
    postpackager: fis.plugin('loader', {
        resourceType: 'amd',
        useInlineMap: true, // 资源映射表内嵌
        processor: {  //预处理jade文件当成是Html页面，在进行一些插件使用时，有必要配置这个参数，比如sass的编译后合并打包处理
            ".jade": "html",
            ".html": "html"
        }
    }),
    spriter: fis.plugin("csssprites", {
        //使用矩阵排列方式，默认为线性`linear`
        layout: 'matrix',
        scale: 1,
        margin: 10
    })  //打包阶段设置合并雪碧图
});

fis.hook("amd");

fis.match("**.json", {
    release: false
});


fis.match("**.css", {
    //useHash: true
});

fis.match("index.jade", {
    parser: fis.plugin("jade"),
    rExt: ".html"
});

//js文件处理

fis
    .match(/^components\/(.*\/)*(.*)\.js$/, {
        isMod: true

    })
    .match(/^\/(pages|widgets|plugin)\/(.*\/)*(.*)\.js$/, {
        isMod: true,
        release: "module/$2/$3"
    });




//pages 页面处理
fis
    .match(/^\/pages\/(.*)\/(.*)\.jade$/, {
        parser: fis.plugin("jade"),
        rExt: ".html",
        release: "pages/$1/$2"
    })
    .match(/^\/pages\/(.*)\/(.*)\.(scss|css)/, {
        parser: fis.plugin("node-sass"),
        rExt: ".css",
        packTo: "static/css/page.css"
    })
    .match("pages/**.{jpg,png}", {
        release: "static/img/$0"
    });


//plugin 插件处理
fis
    .match(/^\/plugin\/(.\/)*(.*)\.jade$/, {
        parser: fis.plugin("jade"),
        rExt: ".html"
    })
    .match(/^\/plugin\/(.\/)*(.*)\.(scss|css)$/, {
        parser: fis.plugin("node-sass"),
        rExt: ".css",
        packTo: "static/css/plugin.css"
    });


//widgets 组件页面处理
fis
    .match(/^\/widgets\/(.\/)*(.*)\.jade$/, {
        parser: fis.plugin("jade"),
        rExt: ".html",
        release: false
    })
    .match(/^\/widgets\/(.\/)*(.*)\.(scss|css)$/, {
        parser: fis.plugin("node-sass"),
        rExt: ".css",
        packTo: "static/css/widgets.css"
    })
    .match(/^\/widgets\/(.*\/)*(.*)\.(jpg|png)$/, {
        release: "static/img/$2"
    });


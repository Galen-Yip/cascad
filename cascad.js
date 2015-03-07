(function($) {
    $(function(){
        var W = $(window),
            Doc = $(document);

        var C = {
            wrap    :$('#wrap'),            //容器（可配置）
            wrapW   :W.width(),             //容器宽度（可配置）
            col     :2,                     //列数（可配置）
            gap     :10,                    //间隙宽度（可配置）
            regular :[-1, 10, 20],          //判断图片是否放大的列高的差值,若小于标准则可放大.
                                            //改成数组的形式，增加其随机性.为了页面美观性，值需要保持在较小范围内
            arr     :[]                     //存储列的高
        };

        C.colW  = (C.wrapW-C.col*C.gap+C.gap)/C.col;   //列的宽度
        C.col2W = 2*C.colW + C.gap;                    //占两列的图片宽度


        //设置样式
        C.wrap.css({width: C.wrapW, margin: '0 auto',position: 'relative'});

        //滚动监听
        W.on('scroll', isToLoad)
        //启动程序
        toAddpic(true)



        function isToLoad() {
            var scrollTop = W.scrollTop(),
                windowH   = W.height(),
                docH      = Doc.height();
            if(docH - scrollTop - windowH <= 50) {
                toAddpic();
            }
        }

        //图片加载,first参数判断是否首次加载
        function toAddpic(first) {
            $.getJSON('img.json', function(data) {
                    var len = data.length;

                    //初始化每列高度
                    if(first) {
                        for(var o = 0; o < C.col; o++) {
                            C.arr[o] = 0
                        }
                    }
                    

                    for(var i = 0; i < len; i++) {
                        var img     = new Image(),
                            arrLen  = C.arr.length,                             //存放列高的数组的长度
                            index   = undefined,                                //记录最小高度的列的索引
                            left    = 0,                                        //图片左边距
                            top     = 0,                                        //图片上边距
                            ratio   = data[i]['width']/data[i]['height'],       //图片的比例
                            width   = 0,                                        //图片要设置的宽度
                            height  = 0,                                        //图片要设置的高度
                            current = 0;                                        //标准
                        
                        //从C.regular中随机取数做标准
                        current = C.regular[Math.floor(Math.random()*C.regular.length)]

                        img.src = data[i]['src'];

                        //从列中选择高度最小的进行图片放置
                        var min = Math.min.apply(null, C.arr);  //选出最小高度
                        index = C.arr.indexOf(min)              //最小高度所在列的索引


                        var forward  = index - 1,
                            backward = index + 1,
                            layout   = undefined;               //放置图片的列的索引


                        if(C.arr[forward] != 'undefined' && (C.arr[forward] - C.arr[index] <= current)) {
                            if(C.arr[backward] != 'undefined' && (C.arr[backward] - C.arr[index] <= current)) {
                                if(C.arr[forward] <= C.arr[backward]) {
                                    layout = forward;
                                    left   = layout * (C.colW + C.gap);
                                    top    = C.arr[layout];
                                    width  = C.col2W;
                                }else{
                                    layout = index;
                                    left   = layout * (C.colW + C.gap);
                                    top    = C.arr[layout];
                                    width  = C.col2W;
                                }
                            }else {
                                layout = forward;
                                left   = layout * (C.colW + C.gap);
                                top    = C.arr[layout];
                                width  = C.col2W;                            
                            }
                        }else {
                            if(C.arr[backward] != 'undefined' && (C.arr[backward] - C.arr[index] <= current)) {
                                layout = index;
                                left   = layout * (C.colW + C.gap);
                                top    = C.arr[layout + 1];
                                width  = C.col2W;
                            }else {
                                layout = index;
                                left   = layout * (C.colW + C.gap);
                                top    = C.arr[layout];
                                width  = C.colW;
                            }
                        }

                        if(first && (i < (arrLen - 2)) ) {
                            width = i == 1 ? C.col2W : C.colW; 
                        }


                        height = width/ratio;                //得出图片此时的高度
                        $(img).css({width: width});          //设置图片宽度

                        var li = $('<li>').css({left: left, top: top});   //设置定位
                        

                        //如果图片放大取较高的列的值来存储
                        if(width == C.col2W) {
                            C.arr[layout] = Math.max(C.arr[layout], C.arr[layout+1]);
                            C.arr[layout+1] = C.arr[layout]
                            C.arr[layout+1] += (height+ C.gap);
                        } 

                        C.arr[layout] += (height+ C.gap)



                        li.append(img)
                        C.wrap.append(li)

                        console.log(C.arr)

                    }
            })
        }

        
    })


})(jQuery)
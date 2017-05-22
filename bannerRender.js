~function (){
    document.documentElement.style.fontSize=document.documentElement.clientWidth/640*100+'px';
}();
var bannerRender=(function (){
    var winW=document.documentElement.clientWidth;
    var $banner=$('.banner');
    var $wrapper=$banner.children('.wrapper');
    var $slideList=$wrapper.children('.slide');
    var $imgList=$wrapper.find('img');
    var $tip=$banner.find('.tip');
    var $dots=$tip.find('li');
    var step=1;
    var minL;
    var maxL;
    var count=0;
    var followTimer=null;
    function isSwipe(strX,strY,endX,endY){
        return Math.abs(endX-strX)>30||Math.abs(endY-strY)>30;
    }
    function swipeDir(strX,strY,endX,endY){
        return Math.abs(endX-strX)-Math.abs(endY-strY)?(endX-strX>0?'right':'left'):(endY-strY>0?'down':'up')
    }
    /*TOUCH START*/
    function dragStart(ev){
        var point=ev.touches[0];//第一个手指的操作信息
        $wrapper.attr({
            strL:parseFloat($wrapper.css('left')),
            strX:point.clientX,
            strY:point.clientY,
            isMove:false,
            dir:null,
            changeX:null
        })
    }
    function dragIng(ev){
        var point=ev.touches[0];
        var endX=point.clientX;
        var endY=point.clientY;
        var strX=parseFloat($wrapper.attr('strX'));
        var strY=parseFloat($wrapper.attr('strY'));
        var strL=parseFloat($wrapper.attr('strL'));
        var changeX=endX-strX;
        var changeY=endY-strY;
        var isMove=isSwipe(strX,strY,endX,endY);
        //console.log(isMove)
        var dir=swipeDir(strX,strY,endX,endY);
        if(isMove&&/(left|right)/i.test(dir)){//有滑动，并且是左右方向的
            $wrapper.attr({
                isMove:true,
                dir,
                changeX
            })
            var curL=strL+changeX;
            curL=curL>maxL?maxL:(curL<minL?minL:curL);
            $wrapper[0].style.webkitTransitionDuration='0s';
            $wrapper.css('left',-step*winW);
            $wrapper.css('left',curL);
        }
    }
    function dragEnd(){
            var isMove=$wrapper.attr('isMove');
            var dir=$wrapper.attr('dir');//获取滑动反向
            var changeX=parseFloat($wrapper.attr('changeX'));
            if(isMove&&/(left|right)/i.test(dir)){
                if(Math.abs(changeX)>=winW/4){
                        if(dir=='left'){
                            step++;
                        }else step--;
                }
                $wrapper[0].style.webkitTransitionDuration='.2s';
                $wrapper.css('left',-step*winW);
                /*动画运动过程中，我们监听一个定时器:动画运动完成判断当前是够运动到边界，如果运动到达了边界，*/
                lazyImg();
                window.clearTimeout(followTimer);
                followTimer=window.setTimeout(function () {
                    if(step==0){
                       step=count-2;
                       $wrapper[0].style.webkitTransitionDuration='0s';
                       $wrapper.css('left',-(count-2)*winW);
                    }if(step==count-1){
                        step=1;
                        $wrapper[0].style.webkitTransitionDuration='0s';
                        $wrapper.css('left',-winW);
                    }
                    window.clearTimeout(followTimer);
                },200)
            }
            autoTip()
    }
    function lazyImg(){
        var step1=step==0?5:step;
        var cur=$slideList.eq(step1);
        var $tar=cur.add(cur.prev()).add(cur.next());//获取到当前显示的图片和它相邻的两张图片
        $tar.each(function (index,item){
            var $img=$(item).children('img');
            if($img.attr('isLoad')==='true'){
                /*如果已经加载过来，那么就返回*/
                return
            }
            var oImg=new Image;
            oImg.src=$img.attr('data-src');
            oImg.onload=function (){
                $img.attr({
                    'src':this.src,
                    isLoad:true
            }).css('display','block');
                oImg=null;
            }
        })
    }
    /*焦点的自动跟随*/
    function autoTip(){
        console.log(step)
        var temp=step==6?1:(step==0?5:step);
        console.log(step)
        $dots.each(function (index,item){
            if(index==temp-1){
                $(item).addClass('bg').siblings().removeClass('bg');
            }
        })
       // window.clearTimeout(followTimer);
        //followTimer;
    }
    /*手动切换焦点*/
    function handleChange(){
        $dots.each(function (index,item){
            $(item).click(function (){
                step=index+1;
                $wrapper.css('left',-step*winW);
                $wrapper[0].style.transitionDuration='0.5s'
                autoTip();
                lazyImg();
            })
        })
    }
    return{
        init:function (){
            count=$slideList.length;
            minL=-($slideList.length-1)*winW;
            maxL=0;
            $wrapper.css('width',$slideList.length*winW);//设置行内样式
            $slideList.css('width',winW)
            lazyImg();
            $banner.on('touchstart',dragStart).on('touchmove',dragIng).on('touchend',dragEnd)
            handleChange();
        }
    }
})();
bannerRender.init();
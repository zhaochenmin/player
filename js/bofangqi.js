window.onload=function() {
  	var musics=[
    	{src:'mp3/1.mp3',name:'我要快乐',artistan:'曾一鸣',duration:'03:31'},
    	{src:'mp3/2.mp3',name:'当爱已成往事',artistan:'曾一鸣',duration:'03:44'},
    	{src:'mp3/3.mp3',name:'黑色幽默',artistan:'曾一鸣',duration:'02:57'},
    	{src:'mp3/4.mp3',name:'伤痕',artistan:'曾一鸣',duration:'03:15'},
    	{src:'mp3/5.mp3',name:'洋葱',artistan:'杨宗纬',duration:'04:38'},
    	{src:'mp3/6.mp3',name:'空白格',artistan:'杨宗纬',duration:'04:45'}
    ]
    $(musics).each(function(index,v){
    	$('<li class=""><strong class="music_name" title="'+v.name+'">'+v.name+'</strong><strong class="singer_name">'+v.artistan+'</strong><strong class="play_time">'+v.duration+'</strong><div class="btn_list"><strong class="btn_like"></strong><strong class="btn_share"></strong><strong class="btn_collect"></strong><strong class="btn_delet"></strong></div></li>').appendTo('.play-list ul');
    });
    //点击歌曲列表播放
    var currentIndex;
    $('.play-list li').on('click',function(){
    	currentIndex=$(this).index();
    	audio.src=musics[ currentIndex ].src;
    	audio.play();
    }); 
    //点击垃圾桶删除曲目
    $('.play-mini .open_list span').text(musics.length);
    $('.play-list .btn_delet').on('click',function(e){
        e.stopPropagation();
        var i=$('.play-list .btn_delet').index(this);
        $(this).closest('li').remove();
        musics.splice(i,1);
        console.table(musics);
        $('.play-mini .open_list span').text(musics.length);
    })
   	var $prev=$('.play-mini .btn_top');
   	var $next=$('.play-mini .btn_down');
   	//切换下一首歌曲
   	$next.on('click',function(){
    	currentIndex+=1;
    	if (!currentIndex) {
       		currentIndex=0;
    	};
      	if (currentIndex>=musics.length) {
        	currentIndex=0;
      	} 
      	audio.src=musics[ currentIndex ].src;
      	audio.play();
   	})
   	//切换上一首歌曲
   	$prev.on('click',function(){
    	currentIndex-=1;
    	if (!currentIndex) {
        	currentIndex=0;
    	};
      	if (currentIndex<0) {
        	currentIndex=musics.length-1;
      	} 
      	audio.src=musics[ currentIndex ].src;
      	audio.play();
   	})
    //播放暂停
	var audio=$('#audio').get(0);
	var $audio=$('#audio');
	$('.btn_zanting').on('click',function(){
    	//空点播放时默认播放第一首歌曲
        if (currentIndex===undefined) {
            currentIndex=0;
            audio.src=musics[currentIndex].src;
        };
		if (audio.paused) {
			audio.play();
		}else{
			audio.pause();
		}
	})
    //播放时更改UI的样式
	$audio.on('play',function(){
		$('.btn_zanting').addClass('btn_bofang')
        $('.play-list li')
        .removeClass('playing')
        .eq(currentIndex)
        .addClass('playing');
        var v=musics[currentIndex];
        $('.play-mini .music_name_qumu').text(v.name);
        $('.play-mini .singer_name_qumu').text(v.artistan);
        $('.play-mini .singer_name_time').text(v.duration);
	});
	$audio.on('pause',function(){
		$('.btn_zanting').removeClass('btn_bofang')
	})

    //音量调节
    $('.volume_op').on('click',function(e){
    	audio.volume=e.offsetX/$(this).width();
    });
    $('.volume .btn_yinliang').on('click',function(){
    	if (!$(this).attr('aa')) {
            $(this).attr('aa',audio.volume);
            audio.volume=0;
    	}else{
    		audio.volume=$(this).attr('aa');
    		$(this).removeAttr('aa');
    	}
    });
    $audio.on('volumechange',function(){
    	if (audio.volume==0) {
    		$('.volume .btn_yinliang').addClass('jingyin');
    	}else{
    		$('.volume .btn_yinliang').removeClass('jingyin');
    	}
    	var w=audio.volume*$('.volume_op').width();
    	$('.volume_op .yinliangtiao').width(w);
    	$('.volume_op .indicator').css({left:w-3});
    });
    $('.volume_op .indicator').on('click',function(e){
    	e.stopPropagation();
    })
	//拖动调节音量
    $('.volume_op .indicator').on('mousedown',function(e){
        e.stopPropagation();
        $(this).closest('.volume_op').addClass('moving');
        $(document).on('mousemove',function(e){
            var left=e.pageX-$('.volume_op').offset().left;
            var v=left/$('.volume_op').width();
            v=(v>1)?1:v;
            v=(v<0)?0:v;
            audio.volume=v;
        })
    })
    $(document).on('mouseup',function(e){
        $('.volume_op').removeClass('moving');
        $(document).off('mousemove');
    }) 


    //歌曲进度
    var $huitiao=$('.play-mini .jiudutiao');
    var $dian=$('.play-mini .zidian');
    var $hongtiao=$('.play-mini .dangqianjindu');
    $audio.on('timeupdate',function(){
        var v=(audio.currentTime/audio.duration)*$huitiao.width();
        $hongtiao.width(v);
        $dian.css({left:v-$dian.width()/2})
    })
    $huitiao.on('click',function(e){
        audio.currentTime=e.offsetX/$huitiao.width()*audio.duration;
        console.log(audio.currentTime)
    });
    $hongtiao.on('click',function(e){
        audio.currentTime=e.offsetX/$huitiao.width()*audio.duration;
    });
    $dian.on('click',function(e){
        e.stopPropagation();
    })

    $dian.on('mousedown',function(e){
        e.stopPropagation();
        $(document).on('mousemove',function(e){
             var left=e.pageX-$huitiao.offset().left;
             var v=left/$huitiao.width()*audio.duration;
             console.log(v);
             audio.currentTime=v;
        })
    })  
    $(document).on('mouseup',function(e){
        $(document).off('mousemove');
    })
    //时间显示功能
    var $jiudutiao=$('.jiudutiao')
    $jiudutiao.on('mouseover',function(e){
    	time=e.offsetX/$jiudutiao.width()*audio.duration;
    	$('.play-mini .tips').find('p').html(zhuanhuan(time));
    	$('.play-mini .tips').css({
        	display:'block',left:e.offsetX-$('.play-mini .tips').width()/2
    	})
    	$jiudutiao.on('mousemove',function(e){
        	time=e.offsetX/$jiudutiao.width()*audio.duration;
        	$('.play-mini .tips').find('p').html(zhuanhuan(time));
    		$('.play-mini .tips').css({
        		display:'block',left:e.offsetX-$('.play-mini .tips').width()/2
    		})
    	})
	});
	$jiudutiao.on('mouseout',function(){
   		$jiudutiao.off('mousemove');
    	$('.play-mini .tips').css('display','none');
	});

	var zhuanhuan=function(time){
    	if (isNaN(time)) {
        	return '--:--';
    	};
    	time=parseInt(time);
    	var min=parseInt(time/60);
    	min=(min<10)?('0'+min):min;
    	var second=time%60;
    	second=(second<10)?('0'+second):second;
    	return min+':'+second;
	}  
}
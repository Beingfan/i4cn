//主页JS特效
$(function(){
	// mac 系统 mac banner提到前面
	if(navigator.userAgent.toLocaleLowerCase().indexOf('mac') > -1) {
		var $winpcBanner = $('.banner_pc');
		var $winpcBannerBox = $winpcBanner.parent();
		var $macpcBanner = $('.banner_Mac');
		var $macpcBannerBox = $macpcBanner.parent();
		$winpcBanner.appendTo($macpcBannerBox);
		$macpcBanner.appendTo($winpcBannerBox);
	}
	//新闻滚动动画
	var indexNewsScroll = {
		timer: 0,
		interval: 4000,
		speed: 500,
		now: 0,
		BannerImdex:0,//首页Banner当前索引index
		BannerSum:($('.banner .slide').length-1),//首页Banner总数
		box: $('.board_news_r'),
		scrollBox: $('.board_news_r > div'),
		btns: $('.board_news_r_btn > a'),
		btnIngClass: 'board_news_r_btn_a',
		go: function(i){
			if(i >= this.btns.length)
				i = 0;
			if(i < 0)
				i = this.btns.length - 1;
			this.now = i;
			this.animate();
			this.changeBtn();
		},
		animate: function(){
			this.scrollBox.animate({
				'margin-left': -this.box.width() * this.now
			}, this.speed)
		},
		changeBtn: function(){
			this.btns.eq(this.now).addClass(this.btnIngClass).siblings().removeClass(this.btnIngClass);
		},
		btnEvent: function(e){
			var i = $(e.currentTarget).index();
			if(this.now == i)
				return;
			this.stop();
			this.go(i);
			this.start();
		},
		start: function(){
			this.stop();
			this.timer = setTimeout(function(){
				this.go(++this.now);
				this.start();
			}.bind(this), this.interval);
		},
		stop: function(){
			if(this.timer)
				clearTimeout(this.timer);
		},
		init: function(){
			this.box.on('mouseenter', function(){
				this.stop();
			}.bind(this)).on('mouseleave', function(){
				this.start();
			}.bind(this));
			this.btns.on('click', function(e){
				this.btnEvent(e);
			}.bind(this));
			
			
			this.start();
		}
	};
	
	//BANNER动画
	var indexBannerScroll = $.extend(true, {}, indexNewsScroll);
	indexBannerScroll.interval = 9000;
	indexBannerScroll.speed = 600;
	indexBannerScroll.box = $('.banner');
	indexBannerScroll.scrollBox = $('.banner_scroll');
	indexBannerScroll.btnIngClass = 'banner_btn_on';
	indexBannerScroll.prevBtn = $('.banner > .btn.prev');
	indexBannerScroll.nextBtn = $('.banner > .btn.next');
	indexBannerScroll.animate = function(){
		
		// var t = $('.banner_pc, .banner_ios, .banner_ios1').eq(Number(!this.now));
		// var b = $('.banner_pc, .banner_ios, .banner_ios1').eq(this.now);
		
		// t.animate({
			// 'opacity': 0
		// }, this.speed, function(e){
			// t.css({
				// 'z-index': 1,
				// 'opacity': 1
			// });
			// b.css({
				// 'z-index': 2
			// });
		// }.bind(this));
	};
	indexBannerScroll.changeBtn = function(){
		
		// this.now ? this.box.addClass('banner_t2') : this.box.removeClass('banner_t2');
		this.btns.eq(this.now).addClass(this.btnIngClass).siblings().removeClass(this.btnIngClass);
	}
	indexBannerScroll.prevBtn.on('click', function(){
		// console.log("左边箭头点击");
		//如果在第一个则跳到最后一个显示
		if(this.BannerImdex==0){
			this.BannerImdex=this.BannerSum;
		}else{
			--this.BannerImdex;
		}
		BannerShow(this.BannerImdex);
		// return;
		// this.stop();
		// this.go(this.now + 1);
		// this.start();
	}.bind(indexBannerScroll));
	indexBannerScroll.nextBtn.on('click', function(){
		// console.log("右边箭头点击");
		//如果在最后一个则跳回第一个
		if(this.BannerImdex==this.BannerSum){
			this.BannerImdex=0;
		}else{
			++this.BannerImdex;
		}
		BannerShow(this.BannerImdex);
		// return;
		// this.stop();
		// this.go(this.now - 1);
		// this.start();
	}.bind(indexBannerScroll));
	//首页顶部Banner循环定时器
	indexBannerScroll.BannerInit=function(){
		// console.log("启动首页Banner循环");
		if(indexBannerScroll.timer) {
			clearInterval(indexBannerScroll.timer);
		}
		indexBannerScroll.timer = setInterval(function(){
			if(indexBannerScroll.BannerImdex==indexBannerScroll.BannerSum){
				indexBannerScroll.BannerImdex=0
			}else{
				++indexBannerScroll.BannerImdex;
			}
			BannerShow(indexBannerScroll.BannerImdex);
		},6000)
	};
	
	indexNewsScroll.init();
	//启动首页Banner循环
	indexBannerScroll.BannerInit();

	//切换应用数据
	$('.board_apps > h2 > a').on('mouseover', function(){
		$(this).addClass('board_apps_h2_tab').siblings().removeClass('board_apps_h2_tab');
		$(this).parents('.board_apps').find('.board_apps_list').eq($(this).index()).addClass('ing').siblings('.board_apps_list').removeClass('ing');
	});
	//切换iPhone iPad数据
	$('.board > h1 > .board_h1_btn > a').on('click', function(){
		$(this).addClass('board_h1_btn_on').siblings().removeClass('board_h1_btn_on');
		$(this).parents('.board').find('.board_apps_r').eq($(this).index()).addClass('ing').siblings('.board_apps_r').removeClass('ing');
		$(this).parents('.board').find('.board_apps_l > .board_apps').eq($(this).index()).addClass('ing').siblings('.board_apps').removeClass('ing');
	});

	// 查看更多友链
	(function(){
		var linksHeight = $('.board_links').find('.content').height();
		$('.board_links').on('click', '.more', function(){
			$('.board_links').toggleClass('ing');
		});
	})();
	
	//首页顶部Banner圆点Click事件
	$(".banner_btn a").click(function(){
		// console.log("Banner小圆点事件");
		//当前点击元素
		var index=$(".banner_btn a").index(this);
		//设置当前索引值
		indexBannerScroll.BannerImdex=index;
		BannerShow(index);
	});
	
	$(".banner").on('mouseenter', function(){
		clearInterval(indexBannerScroll.timer);
	});
	$(".banner").on('mouseleave', function(){
		indexBannerScroll.BannerInit();
	});
	//根据索引显示首页Banner
	function BannerShow(index){
		//移除显示
		$('.banner .slide').removeClass("slide-active");
		//添加显示
		$('.banner .slide').eq(index).addClass("slide-active");
		BannerDot(index);
	}
	//根据索引显示圆点位置
	function BannerDot(index){
		//移除显示
		$('.banner_btn a').removeClass("banner_btn_on");
		//添加显示
		$('.banner_btn a').eq(index).addClass("banner_btn_on");
	}

	
	//首页顶部Banner圆点Click事件
	$(".banner_btn a").click(function(){
		// console.log("Banner小圆点事件");
		//当前点击元素
		var index=$(".banner_btn a").index(this);
		//设置当前索引值
		indexBannerScroll.BannerImdex=index;
		BannerShow(index);
	});
	
	$(".banner").on('mouseenter', function(){
		clearInterval(indexBannerScroll.timer);
	});
});












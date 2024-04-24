//解决 IE6 bind方法无效
if (!Function.prototype.bind) {
	Function.prototype.bind = function (obj) {
		var slice = [].slice, args = slice.call(arguments, 1), self = this, nop = function () {
		}, bound = function () {
			return self.apply(this instanceof nop ? this : (obj || {}),
				args.concat(slice.call(arguments)));
		};

		nop.prototype = self.prototype;

		bound.prototype = new nop();

		return bound;
	};
}

// 浏览器信息
var browserInfo = (function () {
	var version = ["", ""],
		browser = "unkonw",
		agentInfo = navigator.userAgent.toLowerCase();
	if (agentInfo.indexOf("trident/7.0") > -1) {
		version = agentInfo.match(/rv:([\d]+)/);
		browser = "ie"
	}
	if (agentInfo.match(/msie ([\d.]+)/)) {
		version = agentInfo.match(/msie ([\d]+)/);
		browser = "ie"
	}
	if (agentInfo.match(/firefox\/([\d.]+)/)) {
		version = agentInfo.match(/firefox\/([\d]+)/);
		browser = "firefox"
	}
	if (agentInfo.match(/chrome\/([\d.]+)/)) {
		version = agentInfo.match(/chrome\/([\d]+)/);
		browser = "chrome"
	}
	if (agentInfo.match(/opera.([\d.]+)/)) {
		version = agentInfo.match(/opera.([\d]+)/);
		browser = "opera"
	}
	if (agentInfo.match(/version\/([\d.]+).*safari/)) {
		version = agentInfo.match(/version\/([\d]+).*safari/);
		browser = "safari"
	}
	return {
		'name': browser,
		'version': version[1],
		'ua': navigator.userAgent,
		'plug': navigator.plugins
	}
})();

//BASE64
function Base64() {
	// private property
	_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	// public method for encoding
	this.encode = function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
				_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
				_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}

	// public method for decoding
	this.decode = function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = _utf8_decode(output);
		return output;
	}

	// private method for UTF-8 encoding
	_utf8_encode = function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}
		return utftext;
	}

	// private method for UTF-8 decoding
	_utf8_decode = function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}

//COOKIE
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		factory(require('jquery'));
	} else {
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch (e) { }
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
			].join(''));
		}


		var result = key ? undefined : {};

		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				result = read(cookie, value);
				break;
			}

			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));


var i4 = {
	//提示
	alert: function (content) {
		if ($('.alert').length < 1) {
			$('body').append('<div class="alert">' +
				'<div class="box">' +
				'<div class="content"></div>' +
				'<a href="javascript:;" class="close">确定</a>' +
				'</div>' +
				'</div>');
			$('.alert .close').on('click', function () {
				$('.alert').hide();
			});
		}
		$('.alert > .box > .content').html(content);
		$('.alert').show()
	},
	selects: [],
	select: function (dom) {
		$.extend(true, this, dom);
		this.optionsBox = dom.find('.options');
		this.hideInput = dom.find('input');
		this.title = dom.find('.title');

		this.on('click', function () {
			//关闭其它
			this.hasClass('ing') ? this.removeClass('ing') : this.addClass('ing');
			$('.selectdown[name!="' + this.attr('name') + '"]').removeClass('ing');
			return false;
		}.bind(this));
		this.optionsBox.on('click', '.list', function (e) {
			this.title.html($(e.target).html());
			this.hideInput.val($(e.target).attr('data-value'));
			this.optionsBox.find('dd > a').removeClass('ing');
			// this.removeClass('ing');
			$(e.target).addClass('ing').siblings().removeClass('ing');
			this.selectOptionsBack(e);
			return false;
		}.bind(this));
		this.optionsBox.on('click', 'li', function (e) {
			$(e.target).addClass('active').siblings().removeClass('active');
			this.optionsBox.find('dl').eq($(e.target).index()).addClass('active').siblings().removeClass('active');
			return false;
		}.bind(this));
		this.selectOptionsBack = function (e) { };
		this.set = function (v) {
			this.optionsBox.find('.list[data-value="' + v + '"]').click();
		}
		$(document).on('click', function () {
			this.removeClass('ing');
		}.bind(this));
		//设置初始化选中
		if (this.hideInput.val() !== '') {
			this.optionsBox.find('.list[data-value="' + this.hideInput.val() + '"]').click();
		}
		setTimeout(function () {
			if (this.hideInput.val() == 0) {
				this.optionsBox.find('li').eq(0).addClass("active");
				this.optionsBox.find('dl').eq(0).addClass("active");
			}
			this.optionsBox.find('.list[data-value="' + this.hideInput.val() + '"]').parents("dl").addClass("active");
			this.optionsBox.find('dl').each(function (i, dom) {
				if ($(dom).hasClass("active")) {
					this.optionsBox.find('li').eq(i).addClass("active");
				}
			}.bind(this));
		}.bind(this), 100);
	}
};

//应用下拉列表
$.each($('.selectdown'), function (i, o) {
	if ($(o).attr('name'))
		i4.selects[$(o).attr('name')] = new i4.select($(o));
	else
		i4.selects.push(new i4.select($(o)));
});

$(function () {
	//回到顶部
	var backUp = {
		timer: 0,
		dom: $('<div class="back_up" title="返回顶部"></div>'),
		showTop: 200,
		showBottom: $(document).height() - $(window).height() - $('.footer').height(),
		frequency: 200,
		change: function () {
			($(document).scrollTop() > this.showTop) && !this.dom.hasClass('ing') && this.dom.addClass('ing');
			($(document).scrollTop() < this.showTop) && this.dom.hasClass('ing') && this.dom.removeClass('ing');
		},
		doing: function () {
			this.change();
			this.timer = setTimeout(this.doing.bind(this), this.frequency);
		},
		run: function () {
			this.dom.appendTo($('body'));
			this.doing();
			this.dom.on('click', function () {
				$('body,html').animate({ 'scrollTop': 0 });
			});
		}
	};
	backUp.run();

	//顶部搜索
	$('.header > .search > form > input[name="k"]').on('change', function () {
		if ($(this).val() != '')
			$(this).addClass('on');
		else
			$(this).removeClass('on');
	}).on('focus', function () {
		$(this).addClass('on');
	});
	$('.header > .search > form > input[name="k"]').on('blur', function () {
		if ($(this).val() != '')
			$(this).addClass('on');
		else
			$(this).removeClass('on');
	});
	if (browserInfo.name == "ie" && browserInfo.version < 9)//IE9以下事件
	{
		$(document).on('keyup', function (e) {
			if ($('.header > .search > form > input[name="k"]').val() != '')
				$('.header > .search > form > input[name="k"]').addClass('on');
			else
				$('.header > .search > form > input[name="k"]').removeClass('on');
		});
	}
	if ($('.header > .search > form > input[name="k"]').val() != '')
		$('.header > .search > form > input[name="k"]').addClass('on');
	$('.search-box .searchBt').on('click', function () {
		if ($.trim($('.search-box input[name="k"]').val()) == '')
			return;
		else {
			$(this).parents('form').submit();
		}
	});
	$('.search-box .hd li').on('click', function () {
		$('.search-box .hd li').removeClass("active");
		$(this).addClass('active');
		$('.search-box input[name="type"]').val($(this).attr('data-value'));
		$('.search .search-box input').focus();
	});

	//安装PC端提示
	(function () {
		$('body').on('click', '.download_from_pc', function () {
			var downUrl = $(this).attr('down-url');
			$('.download_pc .install1').attr('href', downUrl);
			
			var company = $(this).attr('company');
			$("#down_company").text(company);
			
			var appName = $(this).attr('app_name');
			$("#down_app_name").text(appName);
			
			var down_app_icon_url = $(this).attr('down_app_icon_url');
			$("#down_app_icon_url").attr("src",down_app_icon_url);
			
			
			
//			$('.download_pc .installed').on('click', function () {
//				$.cookie('installed') == 1 ? $.cookie('installed', null) : $.cookie('installed', 1, { expires: 7 });
//				$(this).toggleClass('ing');
//			});
			$('.download_pc .close, .download_pc .small_close').on('click', function () {
				$('.download_pc').removeClass('ing');
			});
//			if ($.cookie('installed') && parseInt($.cookie('installed')) == 1)
//				$('.download_pc .installed').addClass('ing')
			$('.download_pc .title > span').html($(this).html() ? $(this).html() : '下载');
			var downloadUrl = $(this).attr('data-download');
			var b64 = new Base64();
			// mac
			if (navigator.userAgent.toLocaleLowerCase().indexOf('mac') > -1) {
				if (!($.cookie('installed') && parseInt($.cookie('installed')) == 1)) {
					$('.download_pc .install').attr('href', 'https://url.i4.cn/fqIBBbaa');
					$('.download_pc .install').attr('id', 'install2');
					$('.download_pc .install').removeAttr('onclick');
					$('.download_pc').addClass('ing');
				}
				var ToolsCode = JSON.parse(b64.decode($(this).attr("data-download")));
				// window.location.href = 'PCi4Tools://'+ToolsCode.code+'-'+ToolsCode.id;
				var oFrm = document.createElement('iframe');
				oFrm.style.height = '0px';
				oFrm.src = 'PCi4Tools://' + ToolsCode.code + '-' + ToolsCode.id;
				document.body.appendChild(oFrm);
				setTimeout(function () {
					oFrm.remove();
				}, 5000);
				return;
			}
//			$.ajax({
//				url: 'http://127.0.0.1:9999/?json=' + b64.encode('{"code":1}') + '&callback=?',
//				type: "GET",
//				dataType: "JSONP",
//				timeout: 500,
//				complete: function (XMLHttpRequest, textStatus) { },
//				success: function (data, textStatus) {//PC端已打开
//					// 下载
//					$.getJSON('http://127.0.0.1:9999/?json=' + b64.encode(JSON.stringify({ 'code': 3, 'installUrl': downloadUrl })) + '&callback=?', function (data) {
//						//
//					});
//				},
//				error: function (XMLHttpRequest, textStatus, errorThrown) {//未打开PC端
//					if (textStatus == 'timeout') {
						setTimeout(function () {
							try {
								if ((browserInfo.name == "ie" && browserInfo.version == "6") || browserInfo.name == "safari" || browserInfo.name == "opera") {
									var newWin;
									newWin = window.open('PCi4Tools://' + downloadUrl, "\u4e00\u952e\u5b89\u88c5", "width=100, height=10, toolbar=no, menubar=no, scrollbars=no, location=no, status=no'");
									newWin.close()
								} else {
									window.location = 'PCi4Tools://' + downloadUrl;
								}
							} catch (e) { }
							if (!($.cookie('installed') && parseInt($.cookie('installed')) == 1))
								$('.download_pc').addClass('ing');
						}, 250);
//					}
//				}
//			});
		});
	})();
	//底部 快速浏览 链接
	$('.btn_quick_viewing').on('click', function () {
		$('.quick_viewing').toggleClass('ing');
		return false;
	});
	$('.quick_viewing a').on('click', function () {
		$('.quick_viewing').removeClass('ing');
	});
	$(document).on('click', function () {
		$('.quick_viewing').removeClass('ing');
		//  点击其他区域顶部搜索关闭
		$('.search .search-box').removeClass("active");
	});
	if(($(window).scrollTop() + $(window).height())  + 260 >= $(document).height()){
		var bt = (($(window).scrollTop() + $(window).height())  + 260) - $(document).height();
		$(".back_up").css("bottom",(bt + 40)  + "px");
	}else{
		$(".back_up").removeAttr("style");
	}
	$(document).on('scroll', function () {
		// 跳转顶部按钮始终保持在内容底部
		if(($(window).scrollTop() + $(window).height())  + 260 >= $(document).height()){
			var bt = (($(window).scrollTop() + $(window).height())  + 260) - $(document).height();
			$(".back_up").css("bottom",(bt + 40)  + "px");
		}else{
			$(".back_up").removeAttr("style");
		}
	});
	// 顶部搜索点击
	$(".search .search-hint").on('click', function (e) {
		$('.search .search-box').addClass("active");
		$('.search .search-box input').focus()
		e.stopPropagation();
	});
	// 顶部搜索点击 阻止冒泡
	$(".search .search-box").on('click', function (e) {
		e.stopPropagation();
	});
	// 顶部搜索点击 关闭
	$(".search .close").on('click', function () {
		$('.search .search-box').removeClass("active");
	});
	resizeIbox();
	$(window).resize(function() {
		resizeIbox();
	});
});

function resizeIbox(params) {
	$(".ibox").removeClass("ab");
	var winH = $(window).height(); //页面可视区域高度 
	var pageH = $(document.body).height(); //页面高度
	if((pageH) > (winH - 260)){
		$(".ibox").removeClass("ab");
	}else{
		$(".ibox").addClass("ab");
	}
}
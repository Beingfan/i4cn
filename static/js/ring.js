//铃声播放器
$(function(){
	$('body').append('<div class="audio_player"><audio src="img/default.mp3" preload="auto" /></div>');
	var as;
	audiojs.events.ready(function(){
		as = audiojs.createAll({
			trackEnded: function(){
				$('.audio_play').removeClass('ing');
			},
			updatePlayhead: function(percent){
				$('.audio_play.ing').parent().find('.timeline').width((100 * percent) + '%');
			}
		});
	});
	$('.audio_play').on('click', function(){
		if(as[0].playing)
			as[0].pause();
		$('.timeline').width(0);
		if(!$(this).hasClass('ing'))
		{
			$('.audio_play').removeClass('ing');
			var mp3 = $(this).attr('data-mp3') + '?' + Math.random();
			as[0].load(mp3);
			as[0].play();
			$(this).addClass('ing');
			$(this).attr('title', '暂停');
		}
		else
		{
			$(this).removeClass('ing');
			$(this).attr('title', '播放');
		}
	});
});
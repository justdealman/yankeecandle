function setImgCover(e) {
	e.each(function() {
		$(this).parent().css({
			'background-image': 'url("'+$(this).attr('src')+'")',
			'background-repeat': 'no-repeat',
			'background-position': 'center center',
			'background-size': 'cover'
		});
	});
}
function setImgContain(e) {
	e.each(function() {
		$(this).parent().css({
			'background-image': 'url("'+$(this).attr('src')+'")',
			'background-repeat': 'no-repeat',
			'background-position': 'center center',
			'background-size': 'contain'
		});
	});
}
function setRatio() {
	$('[data-ratio]').each(function() {
		var t = $(this).find('.scale');
		t.outerHeight(t.outerWidth()*$(this).attr('data-ratio'));
	});
}
$(function() {
	setImgCover($('.img-cover'));
	setImgContain($('.img-contain'));
	var device = 'desktop';
	var justSwitched = false;
	function detectDevice() {
		var temp = device;
		if ( Modernizr.mq('(min-width:1200px)') ) {
			device = 'desktop';
		} else if ( Modernizr.mq('(max-width:1199px)') && Modernizr.mq('(min-width:780px)') ) {
			device = 'tablet'
		} else if ( Modernizr.mq('(max-width:779px)') ) {
			device = 'mobile'
		}
		if ( temp == device ) {
			justSwitched = false;
		} else {
			justSwitched = true;
		}
	}
	function adaptiveImage() {
		$('.adaptive-image').each(function() {
			$(this).attr('src',$(this).attr('data-'+device+'-image'));
		});
	}
	$('.intro__slider').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		dots: false,
		infinite: true,
		cssEase: 'ease',
		speed: 500,
		fade: true
	});
	$('.latest__slider').slick({
		slidesToShow: 3,
		slidesToScroll: 3,
		arrows: false,
		dots: true,
		infinite: true,
		cssEase: 'ease',
		speed: 500,
		adaptiveHeight: true,
		responsive: [
			{
				breakpoint: 1199,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
			}, {
				breakpoint: 779,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});
	$('.card__slider').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		infinite: true,
		cssEase: 'ease',
		speed: 500
	});
	$('select').selectric({
		responsive: true
	});
	function roundSelect() {
		$('.selectric-wrapper').each(function() {
			$(this).width(Math.ceil($(this).parent().width()));
		});
	}
	function setMinContentHeight() {
		$('.wrapper').css({
			'min-height': $(window).height()-$('.footer').outerHeight()
		});
	}
	function startApp() {
		detectDevice();
		roundSelect();
		if ( justSwitched ) {
			if ( device == 'mobile' ) {
				$('.header__row').prepend('<span class="menu-open"></span>');	
			} else {
				menuClose();
				$('.menu-open').remove();
			}
			if ( device !== 'desktop' ) {
				$('.categories [data="3"]').detach().insertAfter($('.categories [data="6"]'));
				$('.categories').append('<div class="categories__item" data="8"></div>');
				$('.categories [data="7"] .categories__elem').eq(1).detach().appendTo($('.categories [data="8"]'));
				$('.card .share').detach().insertAfter($('.card__controls'));
				$('.card h1').detach().prependTo($('.card__lc'));
			} else {
				$('.categories [data="3"]').detach().insertAfter($('.categories [data="2"]'));
				$('.categories [data="8"] .categories__elem').detach().appendTo($('.categories [data="7"]'));
				$('.categories [data="8"]').remove();
				$('.card .share').detach().appendTo($('.card__lc'));
				$('.card h1').detach().prependTo($('.card__rc'));
			}
		}
		setRatio();
		setMinContentHeight();
	}
	startApp();
	var lastWidth = $(window).width();
	$(window).on('resize', _.debounce(function() {
		if ( $(window).width() != lastWidth ) {
			startApp();
			lastWidth = $(window).width();
		}
	}, 100));
	$('[data-open]').on('click', function(e) {
		e.preventDefault();
		$(this).addClass('is-active');
		var t = $('[data-target="'+$(this).attr('data-open')+'"]');
		t.siblings('[data-target]').removeClass('is-opened is-active');
		$('.fade-bg').addClass('is-opened');
		t.addClass('is-opened');
		var h = $(window).scrollTop()+($(window).height()-t.outerHeight())/2;
		if ( !isMobile ) {
			var diff = 30;
		} else {
			var diff = 15;
		}
		if ( h < $(window).scrollTop()+(diff*2) ) {
			h = $(window).scrollTop()+diff;
		}
		t.css({
			'top': h+'px'
		}).addClass('is-active').siblings('[data-target]').removeClass('is-active');
	});
	$('[data-target] .modal--close, .fade-bg').on('click', function(e) {
		e.preventDefault();
		$('[data-target], .fade-bg').removeClass('is-opened');
		$('[data-open]').removeClass('is-active');
	});
	$('input[type="checkbox"]').uniform();
	
	$(document).on('click', function(e) {
		if ( !$(e.target).closest('.menu-drop').length && !$(e.target).closest('.menu-open').length ) {
			menuClose();
		}
	});
	$('[data-favorite]').on('click', function(e) {
		e.preventDefault();
		$(this).toggleClass('is-active');
	});
	$('.filter--more').on('click', function(e) {
		e.preventDefault();
		var p = $(this).parents('.filter__group');
		var t = p.find('.filter__drop');
		if ( !$(this).hasClass('is-active') ) {
			t.stop().slideDown(200, 'easeInOutSine');
			$(this).text('Скрыть');
		} else {
			t.stop().slideUp(200, 'easeInOutSine');
			$(this).text('Еще');
		}
		$(this).toggleClass('is-active');
	});
	$('.quantity-e .minus').on('click', function(e) {
		e.preventDefault();
		var $input = $(this).parent().find('input');
		var count = parseInt($input.val()) - 1;
		count = count < 1 ? 1 : count;
		$input.val(count);
		$input.change();
    });
	$('.quantity-e .plus').on('click', function(e) {
		var $input = $(this).parent().find('input');
		$input.val(parseInt($input.val()) + 1);
		$input.change();
	});
	$('.card__preview .item').on('click', function(e) {
		var p = $(this).parents('li');
		if ( !p.hasClass('active') ) {
			$('.card__slider').slick('slickGoTo',$(this).attr('data')-1);
			p.addClass('active').siblings().removeClass('active');
		}
	});
	$('.tabs__nav a').on('click', function(e) {
		e.preventDefault();
		var p = $(this).parents('.tabs');
		var t = p.find('.tabs__item[data-tab="'+$(this).attr('href')+'"]');
		if ( !t.is(':visible') ) {
			p.find('.tabs__item').slideUp(200, 'easeInOutSine');
			t.stop().slideDown(200, 'easeInOutSine');
			$(this).parent().addClass('active').siblings().removeClass('active');
		}
	});
	$('.tabs__nav .active a').trigger('click');
	function menuOpen() {
		$('.menu-drop, .fade-bg').addClass('is-opened');
		$('body').addClass('is-locked');
	}
	function menuClose() {
		$('.menu-drop, .fade-bg').removeClass('is-opened');
		$('body').removeClass('is-locked');
	}
	$(document).on('click', '.menu-open', function() {
		menuOpen();
	});
	$('.menu-drop .close-icon').on('click', function() {
		menuClose();
	});
	$('.navigation h4').on('click', function() {
		if ( device == 'mobile' ) {
			$(this).toggleClass('is-dropped');
		}
	});
	$('.filter h3').on('click', function() {
		if ( device == 'mobile' ) {
			$(this).parents('.filter').toggleClass('is-dropped');
		}
	});
	$('input, textarea').each(function() {
		$(this).data('holder', $(this).attr('placeholder'));
		$(this).focusin(function() {
			$(this).attr('placeholder', '');
		});
		$(this).focusout(function() {
			$(this).attr('placeholder', $(this).data('holder'));
		});
	});
});
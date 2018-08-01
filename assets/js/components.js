"use strict";

var $ = jQuery;

var $backButton, header, bannerRevSlider, windowWidth, windowHeight, $home;

function fixBannerHeight($home, windowHeight) {
    var bannerHeight = (windowHeight - 56) + "px";
    $home.css("height", bannerHeight);
}

function skrolrRefresh() {
	if ( 'skrolr' in window ) {
		skrolr.refresh( $('.bg-image:not(".banner-bg")') );
	}
}

$(document).ready(function(){

	/* PARALLAX
	========================================================================== */
	if ( (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) === false) && detectIE() === false) {
		window.skrolr = skrollr.init({
			smoothScrolling : false,
			forceHeight : false,
			easing: {
				//This easing will sure drive you crazy
				wtf: Math.random,
				inverted: function(p) {
					return 1 - p;
				}
			}
		});
	}

	/* SEARCH 
	========================================================================== */
	(function(){

		var sCon = $('#fullSearch');
		$('.search-open').on('click', function(e){

			var scale = $(window).width() * 2 / 45;
			
			sCon.find('.search-bg').css({
				'transform': 'scale('+scale+')',
				'top': e.pageY+'px',
				'left': e.pageX+'px'
			});

			sCon.addClass('show').removeClass('hide-bg');

			var handler = setTimeout(function(){
				sCon.addClass('show-contents');
				clearTimeout(handler);

				$( "#search-input" ).focus();
			}, 600);
		});

		$('.search-close').on('click', function(e){
			if( sCon.hasClass('show')){
				sCon.addClass('hide-bg').removeClass('show-contents');
				var handler = setTimeout(function(){
					sCon.removeClass('show');
					clearTimeout(handler);
				}, 600);
			}
		});
		
	}());


	/* MOBILE MENU
	========================================================================== */

	$('.mobile-menu ul li.dropdown-item a').on('click', function (e) {
		// e.preventDefault();
        $(this).siblings('ul').slideToggle();
        $(this).toggleClass('angle-down');
        // $(this).children('.arrow').find('i').toggleClass('fa-angle-down fa-angle-up');
    });

	// Dynamic menu side change
	$('.main-nav').dynamicSubmenuSide();

	window.menuFun = {
		show: function($this){
			
			if ( !$this ) { $this = $('.mobile-menu-area .active'); }
			$('body').addClass('active-mobile-menu');

			$('#menu-back-btn').addClass('active').siblings().removeClass('active');
		},

		hide: function($this){
			if ( !$this ) { $this = $('.mobile-menu-area .active'); }
			$('body').removeClass('active-mobile-menu');

			$('#menu-show-btn').addClass('active').siblings().removeClass('active');
		}
	};

	$('.mobile-menu-area > i').on('click', function(e){
		if ( $(this).attr('id') == 'menu-show-btn' ) {
			menuFun.show($(this));
		} else {
			menuFun.hide($(this));
		}
	});

	$('.nav-overlay-bg').on('click', function(){
		menuFun.hide();
	});


	/* JW PLAYER VIDEO / AUDIO POST
	========================================================================== */
	(function(){

		$('.player').each(function(){

			var $this = $(this),

			defaults = {
				fileSrc : '',
				imageSrc : '',
				id : '',
				width : '100%',
				height : '100%',
				aspectratio : ''
			},

			config = {
				fileSrc : $(this).data('file-src') || defaults.fileSrc,
				imageSrc : $(this).data('image-src') || defaults.imageSrc,
				id : $(this).attr('id'),
				width : $(this).data('width') || defaults.width,
				height : $(this).data('height') || defaults.height,
				aspectratio : $(this).data('aspectratio') || defaults.aspectratio
			};

			var player = jwplayer(config.id).setup({
				file: config.fileSrc,
				image: config.imageSrc,
				width: config.width,
				height: config.height,
				aspectratio : config.aspectratio
			});

			player.onPlay(function(e){
				$(this.container).find('.jwcontrolbar').show();
				$(this.container).closest('.post-thumb-wrap').find('.post-meta-info').hide();
			}).onComplete(function(){
				$(this.container).find('.jwcontrolbar').hide();
				$(this.container).closest('.post-thumb-wrap').find('.post-meta-info').show();
			});

		});

	}());


	/* INITIALIZE VARIABLES
	========================================================================== */
    windowWidth = $(window).width();
    windowHeight = $(window).height();
	header = $('header.site-navbar');
	$home = $('#home');


	/* BANNER HEIGHT
    ========================================================================== */
    if ( $home.length > 0 ) {
    	fixBannerHeight($home, windowHeight);
    }


	/* BLOG SOCIAL SHARE
	========================================================================== */
	$('body').delegate('.js-post-share-media li a', 'click', function(e){

		e.preventDefault();

		var $parent = $(this).parent();
		var link = $(this)[0].baseURI;
		link += $(this).attr('href');

		if ( $parent.hasClass('fb') ) {
			window.open( 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(link), 'facebookWindow', 'width=650,height=350');
		}

		if ( $parent.hasClass('tw') ) {
			window.open( 'http://twitter.com/intent/tweet?text='+ $(this).closest(".mdl-card").find(".mdl-card__title-content").text() +' '+ link, "twitterWindow", "width=650,height=350" );
		}

		if ( $parent.hasClass('gplus') ) {
			window.open( 'https://plus.google.com/share?url='+encodeURIComponent(link), 'googleWindow', 'width=500,height=500');
		}

		if ( $parent.hasClass('lin') ) {
			window.open( 'http://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(link)+'&title='+$(this).closest(".mdl-card").find(".mdl-card__title-content").text(), 'linkedinWindow', 'width=650,height=450, resizable=1');
		}

	});


	/* REMOVE LINKS DEFAULT BEHAVIOR
	========================================================================== */
	$('a[href="javascript:void(0)"]').on('click', function(e){
		e.preventDefault();
	});


	/* BLOG MASONRY
	========================================================================== */
	var $blog_post_masonry = $('#blog-posts-mesonary');
	
	if ( $blog_post_masonry.length > 0 ) {
		
		window.blogMsnry = $blog_post_masonry.isotope({
			itemSelector: '.single-blog-post',
			isInitLayout: false,
			layoutMode: 'masonry'
		});

		blogMsnry.isotope('layout');
	}


	/* FLICKR FEED
	========================================================================== */
	var $flickr_images = $('#flickr-images');

	if ( $flickr_images.length > 0 ) {
		$flickr_images.jflickrfeed({
			limit: 12,
			qstrings: {
				id: '149279304@N05'		// PLACE YOUR QUERY_ID HERE, CHECK DOCUMENTATION FOR IT
			},
			itemTemplate: '<li class="flickr-image"><a href="{{image_b}}"><img src="{{image_b}}" alt="{{title}}" /></a></li>'
		}, function(){

			$flickr_images.imagesLoaded().then(function(){

				$flickr_images.find('a').magnificPopup({
					type: 'image',
			        fixedContentPos: true,
			        fixedBgPos: true,
					mainClass: 'mfp-default-popup',
					closeMarkup: '<i class="zmdi zmdi-close mfp-close mfp-close--zoom"></i>',
					
					gallery: {
						enabled: true,
						navigateByImgClick: true,
						arrowMarkup: '<i class="zmdi zmdi-chevron-%dir%"></i>'
					},

					image: {
						verticalFit: true
					},

					zoom: {
						enabled: true,
						duration: 300 // don't foget to change the duration also in CSS
					}
				});

				window.flickrMsnry = $flickr_images.isotope({
					itemSelector: '.flickr-image',
					isInitLayout: false,
					layoutMode: 'masonry'
				});

				var handler = setTimeout(function(){
					clearTimeout(handler);
					window.flickrMsnry.isotope('layout');

					skrolrRefresh();

				}, 200);
			});

		});
	}


	/* INSTAGRAM FEED
	========================================================================== */
	var $instafeed_wrapper = $('#instafeed');

	if ( $instafeed_wrapper.length > 0 ) {
		var feed = new Instafeed({
			get: 'user',
			userId: '4989819598',	// YOUR_USER_ID
			limit: 8,
			resolution: 'standard_resolution',
			accessToken: 'YOUR_ACCESS_TOKEN',
			after: function() {

				$instafeed_wrapper.imagesLoaded().then(function(){

					$instafeed_wrapper.find('img').magnificPopup({
						type: 'image',
				        fixedContentPos: true,
				        fixedBgPos: true,
						mainClass: 'mfp-default-popup',
						closeMarkup: '<i class="zmdi zmdi-close mfp-close mfp-close--zoom"></i>',
						
						gallery: {
							enabled: true,
							navigateByImgClick: true,
							arrowMarkup: '<i class="zmdi zmdi-chevron-%dir%"></i>'
						},

						image: {
							verticalFit: true
						},

						zoom: {
							enabled: true,
							duration: 300 // don't foget to change the duration also in CSS
						},

						callbacks: {
							elementParse: function(item) {
								item.src = item.el.attr('src');
							}
						}
					});

					window.instafeedMsnry = $instafeed_wrapper.isotope({
						itemSelector: 'a',
						isInitLayout: false,
						layoutMode: 'masonry'
					});

					var handler = setTimeout(function(){
						clearTimeout(handler);
						window.instafeedMsnry.isotope('layout');

						skrolrRefresh();
					}, 200);
				});
	        },
		});

		feed.run();
	}


	/* DRIBBBLE FEED
	========================================================================== */
	var $dribbble_wrapper = $('#dribbblefeed');

	if ( $dribbble_wrapper.length > 0 ) {
		// NOTE: Don't use this token, replace it with your own client access token.
		$.jribbble.setToken('PLACE_YOUR_ACCESS_TOKEN');

		$.jribbble.shots(2046896).rebounds().then(function(res) {
			var html = [];

			res.forEach(function(shot) {
				html.push('<li class="shots--shot">');
				html.push('<a href="' + shot.html_url + '" target="_blank">');
				html.push('<img src="' + shot.images.normal + '">');
				html.push('</a></li>');
			});

			$dribbble_wrapper.html(html.join('')).imagesLoaded().then(function(){

				$dribbble_wrapper.find('img').magnificPopup({
					type: 'image',
			        fixedContentPos: true,
			        fixedBgPos: true,
					mainClass: 'mfp-default-popup',
					closeMarkup: '<i class="zmdi zmdi-close mfp-close mfp-close--zoom"></i>',
					
					gallery: {
						enabled: true,
						navigateByImgClick: true,
						arrowMarkup: '<i class="zmdi zmdi-chevron-%dir%"></i>'
					},

					image: {
						verticalFit: true
					},

					zoom: {
						enabled: true,
						duration: 300 // don't foget to change the duration also in CSS
					},

					callbacks: {
						elementParse: function(item) {
							item.src = item.el.attr('src');
						}
					}
				});

				window.dribbbleMsnry = $dribbble_wrapper.isotope({
					itemSelector: '.shots--shot',
					isInitLayout: false,
					layoutMode: 'masonry'
				});

				var handler = setTimeout(function(){
					clearTimeout(handler);
					window.dribbbleMsnry.isotope('layout');

					skrolrRefresh();
				}, 200);
			});

		});
	}


	/* SOCIAL TABS MESONRY FIX
	========================================================================== */
	$('.social-mdl-tabs .mdl-tabs__tab').on('click', function(){

		var msnrys = ['flickrMsnry', 'instafeedMsnry', 'dribbbleMsnry'];

		var handler = setTimeout(function(){

			clearTimeout(handler);

			msnrys.forEach(function( msnry ){

				if ( msnry in window ) {
					if( window[msnry].is(':visible') ) {
						window[msnry].isotope('layout');

						skrolrRefresh();
					}
				}

			});

		}, 100);
	});


	window.resumeMsnry = [];
	$('.resume-masonry').each(function(){

		window.resumeMsnry.push($(this));

		$(this).isotope({
			itemSelector: '.resume-masonry__item',
			isInitLayout: false,
			layoutMode: 'masonry'
		});
	});


	/* MENU SMOOTH SCROLL
	========================================================================== */
	$('.menu-smooth-scroll').scrollingTo({
		easing : 'easeOutQuad',
		extraSpace : 70,
		callbackBeforeTransition : function(){
			menuFun.hide();
		}
	});


	/* PROGRESS BAR
	========================================================================== */
	var progressBars =  $('[data-action="progress-bar"]');

	if ( progressBars.length > 0 ) {
		progressBars.waypoint({

			handler: function(event, direction) {

		    	$(this).find(".progress-bar__active").each(function() {
		    		var $this = $(this);
		    		$this.width($this.attr("data-percent"));
		    	});
			},
			offset: '90%'
		});
	}


    /* OWL CAROUSEL
    ========================================================================== */

    var globalOwlOptions = {
		navRewind: false,
		navClass: ['owl-prev mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--fab', 'owl-next mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--fab'],
		navText: ['<i class="zmdi zmdi-chevron-left"></i>', '<i class="zmdi zmdi-chevron-right"></i>'],
    }

    var owl = $(".owl-carousel");

    if ( owl.length > 0 ) {

    	owl.each(function() {

    		var owl_options = $(this).data("owl-options");

    		owl_options = (owl_options) ? owl_options : {};

    		var options = $.extend({}, globalOwlOptions, owl_options);

    		$(this).owlCarousel(options);
    	});

    }


	/* MAGNIFIC POPUP
	========================================================================== */

	// PORTFOLIO CUSTOM POPUP
	$('.protfolio-items').magnificPopup({
		delegate: 'a.portfolio-custom-popup',
		type: 'ajax',
        mainClass: 'my-mfp-zoom-in',
		removalDelay: 300,
        fixedContentPos: true,
        fixedBgPos: true,
		closeMarkup: '<i class="zmdi zmdi-close mfp-close"></i>'
	});

	// PORTFOLIO DEFAULT POPUP
	$('.protfolio-items').parent().magnificPopup({
		delegate: '.portfolio-default-popup',
		type: 'image',
		mainClass: 'mfp-default-popup',

		fixedContentPos: true,
        fixedBgPos: true,
		
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			arrowMarkup: '<i class="zmdi zmdi-chevron-%dir%"></i>'
		},

		zoom: {
			enabled: true,
			duration: 300 // don't foget to change the duration also in CSS
		},

		closeMarkup: '<i class="zmdi zmdi-close mfp-close mfp-close--zoom"></i>'
	});

	// AJAX PORTFOLIO DETAILS
	$('body').magnificPopup({
		delegate: 'a.ajax-portfolio-details',
        mainClass: 'mfp-fade',
		type: 'ajax',
		removalDelay: 300,
		showCloseBtn: false
	});

	// PORTFOLIO DETAILS ATTACHMENT CHANGE
	$('body').delegate('a.portfolio-details-image-link', 'click', function(e){
		e.preventDefault();
		$(this).addClass('active').siblings('a').removeClass('active');
		var image = '<img src="'+ $(this).attr('href') +'" alt="">';
		$(this).closest('.profolio-preview').find('.pre-body-inner').html(image);
	});

	// PORTFOLIO DETAILS POPUP CLOSE
	$('body').delegate('.pre-close a', 'click', function(e){
		e.preventDefault();
		var magnificPopup = $.magnificPopup.instance;
		magnificPopup.close();
	});

	// PORTFOLIO ATTCHMENT ZOOM
	$('body').delegate('.pre-body-inner img', 'click', function(e){
		$(this).closest('.profolio-preview').toggleClass('zoomed');
	});

	// POPUP YOUTUBE
    $('.popup-youtube').magnificPopup({
		type: 'iframe',
        mainClass: 'mfp-fade mfp-default-popup mfp-iframe',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: true,
        fixedBgPos: true,
		closeMarkup: '<i class="zmdi zmdi-close mfp-close"></i>'
	});

	// SKILL SLIDER
	$('.skill-slider').find('.owl-stage-outer').wrapAll("<div class='owl-stage-outer-wrapper' />");


    /* HAMBURGER
    ========================================================================== */
    $('.mobile-menu-trigger').on("click", function(e) {

    	$(this).toggleClass('mobile-menu-trigger--clicked').find('.hamburger').toggleClass('is-active');
    	$('.mobile-menu').toggleClass('mobile-menu--visible');

    });


    /* MEMBER HOVER SKILL
    ========================================================================== */
    var member = $(".member");

	if ( member.length > 0 ) {
	    member.hover(
		    function() {
		    	$(this).find(".progress-bar__active").each(function() {
		    		var $this = $(this);
		    		$this.width($this.attr("data-percent"));
		    	})
		    },
		    function() {
		    	member.find(".progress-bar__active").width(0);
		    }
		);
	}


    /* SKILL
    ========================================================================== */
    $(".single-skill").waypoint({
		handler: function(event, direction) {
		    $(this).find(".progress-bar__bar__active").each(function() {
		    	var width = $(this).closest(".progress-bar").find(".progress-bar__label span").html();
		    	$(this).width(width);
		    });
		},
		offset: '90%'
	});


    /* FUN FACT
    ========================================================================== */
	var $fun_counter = $('.single-fun__fact__number__counter');

	if ( $fun_counter.length > 0 ) {
	    $fun_counter.counterUp({
		    delay: 30,
		    time: 1500
		});
	}


    /* BACK TO TOP
    ========================================================================== */
	$backButton = $('#backToTop');

	if ( $backButton.length > 0 ) {
		window.backToTop = {

			button : $backButton,

			show : function() {
				var self = this;
				if ( self.button.hasClass('hide-right') ) {
					self.button.removeClass('hide-right');

					var handler = setTimeout(function(){
						self.button.removeClass('shade-on');
						clearTimeout(handler);
					}, 750);
				}
			},

			hide : function() {
				var self = this;
				if ( !self.button.hasClass('hide-right') ) {
					self.button.addClass('shade-on hide-right');
				}
			},

			enableBackToTop : function() {
				var self = this;
				if ( !self.button.hasClass('rotate') ) {
					self.button.addClass('rotate').data('action', 'top');
				}
			},

			enableSectionCall : function() {
				var self = this;
				if ( self.button.hasClass('rotate') ) {
					self.button.removeClass('rotate').data('action', 'bottom');
				}
			}
		};

		function getNextSection(currentSection) {
			var section = currentSection.next();
			if ( !section.hasClass('section-main') ) {
				return getNextSection( section );
			}
			return section;
		}

		$backButton.on('click', function(){

			if ( $(this).data('action') && $(this).data('action') == 'top' ) {

				$('html, body').stop(true, true).animate({
					'scrollTop' : '0px'
				}, 1500, 'easeOutQuad');

			} else {
				var currentSection = $('.section-main.section-active');
				// var nextSection = currentSection.next('.section-main');

				var nextSection = getNextSection(currentSection);

				var headerHeight = header.outerHeight();

				headerHeight = ( headerHeight > 70 ) ? 70 : headerHeight;

				$('html, body').stop(true, true).animate({
					'scrollTop' : ( nextSection.offset().top - headerHeight )+'px'
				}, 800, 'easeOutQuad');
			}

		});
	}



    /* SECTION SCROLLING
    ========================================================================== */
	(function(){

		var sections = $(".section-main");

		var getActiveSectionLength = function(section, sections) {
			return sections.index(section);
		};

		if ( sections.length > 0 ) {

			sections.waypoint({

				handler: function(event, direction) {

					var active_section, active_section_index, prev_section_index, length;

					length = sections.length;

					active_section = $(this);
					active_section_index = getActiveSectionLength($(this), sections);
					prev_section_index = ( active_section_index - 1 );

					if (direction === "up") {
						active_section = sections.eq(prev_section_index);
					}

					// Updating the section active class
					sections.removeClass('section-active');
					active_section.addClass('section-active');

					// BackToTop on click button functions
					if ( active_section_index == length - 1 ) {
						$('.menu-smooth-scroll').parent('li').removeClass('active');
						backToTop.enableBackToTop();
					} else {
						backToTop.enableSectionCall();
					}

					// Menu link active class update
					var active_link = $('.menu-smooth-scroll[href="#' + active_section.attr("id") + '"]');
					active_link.parent('li').addClass("active").siblings().removeClass("active");

					if ( active_section.attr('id') == 'home' ) {
						$('.menu-smooth-scroll').parent('li').removeClass('active');
					}

				},

				offset: '35%'
			});
		}

	}());


    /* CONTACT FORM
    ========================================================================== */

    // Submit button states
	var personxForm = $('.personx-form-valid');
	if ( personxForm.length > 0 ) {
		personxForm.personxSubmitValidate();
	}

	// Form Submit
	$('#contactForm').on('submit', function(e){
		e.preventDefault();

		var $this = $(this),
			data = $(this).serialize(),
			name = $this.find('#name'),
			email = $this.find('#email'),
			message = $this.find('#message'),
			loader = $this.find('.form-loader-area'),
			submitBtn = $this.find('button, input[type="submit"]');

		loader.show();
		submitBtn.attr('disabled', 'disabled');

		var success = function(response) {
			swal("Thanks!", "Your message has been sent successfully!", "success");
			$this.find("input:not('[type=submit]'), textarea").val("");
			$this.find(".is-dirty, .is-invalid").removeClass('is-dirty is-invalid');
		};

		var error = function(response) {
			$this.find('.is-invalid').removeClass('is-invalid');
			if ( response.name ) {
				name.closest('.mdl-textfield').addClass('is-invalid');
			}

			if ( response.email ) {
				email.closest('.mdl-textfield').addClass('is-invalid');
			}

			if ( response.message ) {
				message.closest('.mdl-textfield').addClass('is-invalid');
			}
		};

		$.ajax({
			type: "POST",
			url: "assets/inc/sendEmail.php",
			data: data
		}).done(function(res){

			var response = JSON.parse(res);

			( response.OK ) ? success(response) : error(response);

			var hand = setTimeout(function(){
				loader.hide();
				clearTimeout(hand);
			}, 1000);

		}).fail(function(){

			sweetAlert("Oops...", "Something went wrong, Try again later!", "error");

			var hand = setTimeout(function(){
				loader.hide();
				submitBtn.removeAttr('disabled');
				clearTimeout(hand);
			}, 1000);

		});
	});


    /* GOOGLE MAP
    ========================================================================== */
    
	// Google Map show
	$('#map-open').on('click', function(e){
		e.preventDefault();
		$(this).hide().siblings('.mdl-button--map').show();

		$('.map-wrapper').css('margin-top', '0px');
	});

	// Google Map hide
	$('#map-close').on('click', function(e){
		e.preventDefault();
		$(this).hide().siblings('.mdl-button--map').show();

		$('.map-wrapper').css('margin-top', '-' + $('.map-wrapper').height() + 'px');
	});

	// Map
	var mapStyle=[{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];

	var mapWrapperID = '#map', draggableOp = ( $.browser.mobile === true ) ? false : true;

	if ( $(mapWrapperID).length > 0 && window.google && window.google.maps ) {

		window.mapOps = {
			lat : 37.386051,	// Provide your latitude
			lng : -122.083855, // Provide your longitude
			content: '<p class="mapLocation">Mountain View, CA, USA</p>', // Provide your address to show on pop up
			icon: 'img/marker-icon.png',
			zoom : 15,
			panBy : { x: 0, y: -40 }
		};

		// var infoWindow = new google.maps.InfoWindow({
		//     content: '<p>Coder Pixel, Gulshan 1, Dhaka, Bangladesh</p>'
		// });

		window.map = new GMaps({
			div: mapWrapperID,
			lat : mapOps.lat,
			lng : mapOps.lng,
			scrollwheel: false,
			draggable: draggableOp,
			zoom: mapOps.zoom,
			disableDefaultUI: true,
			styles : mapStyle
		});


		map.addMarker({
			lat : mapOps.lat,
			lng : mapOps.lng,
			icon: mapOps.icon,
			infoWindow: {
				content: mapOps.content
			}
			// infoWindow: infoWindow
		});

		map.panBy(mapOps.panBy.x, mapOps.panBy.y);
		// infoWindow.open(map,marker);
	}

	$(window).on('scroll', function(){

        /* FIXED HEADER
        ========================================================================== */

		if ($(window).scrollTop() > 0) {

			$('body').addClass('scrolled');

			$('.site-navbar').addClass('site-navbar--scrolled');

			$('.site-logo__image-2').show();
			$('.site-logo__image-1').hide();

			$('.banner__content').css("padding-top", '70px');

		} else {

			$('body').removeClass('scrolled');

			$('.site-navbar').removeClass('site-navbar--scrolled');

			$('.site-logo__image-2').hide();
			$('.site-logo__image-1').show();

			$('.banner__content').css("padding-top", '100px');

		}

	});


});


$(window).load(function(){

	/* PRELOADER
	========================================================================== */
	$('#loader').fadeOut();


	/* Isotop layout fix for Blog Posts
	========================================================================== */
	if ( window.blogMsnry ) {
		blogMsnry.isotope('layout');
	}

	/* Isotop layout fix for Resume
	========================================================================== */
	if ( window.resumeMsnry ) {
		resumeMsnry.forEach(function(msnry){
			msnry.isotope('layout');
		});
	}

	/* WOW
	========================================================================== */
	new WOW({
		offset: 150,
		mobile: false
	}).init();


	/* PORTFOLIO ISOTOPE
	========================================================================== */
	var portfolioArea = $('[data-action="portfolio"]');

	if ( portfolioArea.length > 0 ) {

		portfolioArea.each(function(){

			var $this = $(this);
			var loadMoreURL = $this.data('portfolio-url');

			var portfolioIsotop = $this.find('.protfolio-items');

			// init Isotope
			var loaded = 0, ajaxItems, loadMore = true, currentFilter = '*',
				$loadMoreBtn = $this.find('[data-action="portfolioLoadItem"]'),
				$ajaxItemsDiv = $this.find('[data-action="portfolioInitItem"]');

			var portfolioMsnry = portfolioIsotop.isotope({
				isOriginLeft: !window.RTL_Enabled,
				itemSelector: '.single-portfolio',
				layoutMode: 'fitRows',
				transitionDuration: '.6s',
				hiddenStyle: {
					opacity: 0,
					transform: "scale(.85)"
				},
				visibleStyle: {
					opacity: 1,
					transform: "scale(1)"
				}
			});


			$this.find('.portfolio-category .filter').on( 'click', function(e) {

				e.preventDefault();

				if( $loadMoreBtn.length > 0 ) {
					$loadMoreBtn.removeAttr('disabled');
				}

				if ( $(this).hasClass('active') ) {
					return false;
				} else {
					$(this).addClass('active').siblings('li').removeClass('active');
				}

				var $this = $(this);
				var filterValue = $this.data('target');

				if ( filterValue == '*' ) {
					currentFilter = '*';
				} else {
					currentFilter = $this.text();	
				}

				// set filter for Isotope
				portfolioMsnry.isotope({ filter: filterValue });

				// Refresh skrollr elements
				var handler = setTimeout(function(){
					skrolrRefresh();
					clearTimeout(handler);
				}, 1500);

				return $(this);
			});

			var loadData = function(ajaxItems, $btn) {
				if ( ajaxItems ) {
					var lists, loadedIds = [], target = $this.find('.portfolio-category .filter.active').data('target');

					portfolioIsotop.children().each(function(){
						loadedIds.push($(this).attr('id'));
					});

					if ( target != '*' ) {
						lists = $(ajaxItems).find('.single-portfolio'+target).filter(function(){
							return ( loadedIds.indexOf( $(this).attr('id') ) == -1 );
						});
					} else {
						lists = $(ajaxItems).find('.single-portfolio').filter(function(){
							return ( loadedIds.indexOf( $(this).attr('id') ) == -1 );
						});
					}

					loadMore = ( lists.length < 1 ) ? false : true;

					if ( loadMore === true ) {

						$ajaxItemsDiv.html(lists).imagesLoaded().then(function(){
							for (var i = 0; i < 3; i++) {
								var $this = $ajaxItemsDiv.children().first();

								if ( $this.index() < 0 ) {

									$btn.attr('disabled', 'disabled');

								} else {

									portfolioMsnry.isotope( 'insert', $this );
									
									// Refresh skrollr elements
									var handler = setTimeout(function(){
										skrolrRefresh();
										clearTimeout(handler);
									}, 1500);

									if ( $ajaxItemsDiv.children().length > 0 ) {
										$btn.removeAttr('disabled');
									} else {
										$btn.attr('disabled', 'disabled');
									}
								}
							}
						});

					} else {

						if ( target == '*' ) {
							sweetAlert("Sorry", "There are no items", "info");
						} else {
							sweetAlert("Sorry", "There are no "+currentFilter+" items", "info");
						}

						$btn.attr('disabled', 'disabled');

					}
				}
			};

			if ( $loadMoreBtn.length > 0 ) {

				$loadMoreBtn.on( 'click', function(e) {

					e.preventDefault();

					var $this = $(this);

					$this.attr('disabled', 'disabled');

					if ( ajaxItems ) {

						loadData(ajaxItems, $this);

					} else {

						$.ajax({
							cache: false,
						    url: loadMoreURL,
						    success: function(data) {
						    	ajaxItems = data;
						    	loadData(ajaxItems, $this);
						    }
						});
					}
				});
			}
		});
	}

	var backToTopHandler = setTimeout(function(){
		clearTimeout(backToTopHandler);
		backToTop.show();
	}, 700);

	/* Parallax Fix
	========================================================================== */
	skrolrRefresh();

});


doneResize(function(){

	// Re assigned new values
	windowWidth = $(window).width();
    windowHeight = $(window).height();

    // Banner Height Fix
    if ( $home.length > 0 ) {
    	fixBannerHeight($home, windowHeight);
    }
});
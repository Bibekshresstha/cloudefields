document.fonts.ready.then((fontFaceSet) => {

    //init scrollsmoother
    if (jQuery(window).width() > 767) {
        gsap.registerPlugin(ScrollSmoother);
        ScrollSmoother.create({
            wrapper: "#wrapper",
            content: "#wrapper-inn",
            smooth: 1,
            effects: true,
            normalizeScroll: true,
            smoothTouch: 0.1
        });
    }

    jQuery('.is-sticky').each(function () {
        var element = jQuery(this);
        ScrollTrigger.create({
            trigger: element,
            start: "top top",
            end: "+=120%",
            pin: true,
            pinSpacing: false,
            onEnter: function () {
                element.addClass('is-pinned');
            },
            onLeave: function () {
                element.removeClass('is-pinned');
            },
            onEnterBack: function () {
                element.addClass('is-pinned');
            },
            onLeaveBack: function () {
                element.removeClass('is-pinned');
            }
        });
    });

    jQuery(".anim-opacity").each(function () {
        var element = this;
        gsap.to(element, {
            opacity: 0,
            scrollTrigger: {
                trigger: element,
                start: "top top",
                end: "bottom top",
                scrub: true,
                onUpdate: function (self) {
                    var progress = self.progress;
                    var currentOpacity = 1 - progress; // Calculate opacity based on progress

                    if (currentOpacity < 1) {
                        jQuery(element).addClass('is-fading');
                    } else {
                        jQuery(element).removeClass('is-fading');
                    }
                }
            }
        });
    });

    jQuery(".scroll-left").each(function () {
        var element = jQuery(this);
        gsap.from(element, {
            xPercent: -100,
            scrollTrigger: {
                trigger: element,
                start: "top 120%",
                end: "bottom 70%",
                scrub: true,
            }
        });
    });

    // Wrap each word with span
    jQuery('.wrap-word').each(function () {
        var self = jQuery(this);

        // Function to wrap words while preserving highlight class elements
        function wrapWords(element) {
            var contents = element.contents();
            var result = [];

            contents.each(function () {
                // If it's a text node
                if (this.nodeType === 3) {
                    var text = this.textContent;
                    var words = text.split(' ').filter(function (word) {
                        return word.length > 0;
                    });

                    words.forEach(function (word, index) {
                        result.push('<span class="custom-word">' + word + '</span>');
                        // Add space between words except for the last one
                        if (index < words.length - 1) {
                            result.push(' ');
                        }
                    });
                }
                // If it's an element node
                else if (this.nodeType === 1) {
                    var $elem = jQuery(this);

                    // If it has highlight class, preserve it as is
                    if ($elem.hasClass('highlight')) {
                        result.push($elem[0].outerHTML);
                    } else {
                        // Recursively process other elements
                        var tagName = this.tagName.toLowerCase();
                        var attrs = '';

                        // Preserve attributes
                        jQuery.each(this.attributes, function () {
                            attrs += ' ' + this.name + '="' + this.value + '"';
                        });

                        result.push('<' + tagName + attrs + '>');
                        wrapWords($elem);
                        result.push('</' + tagName + '>');
                    }
                }
            });

            // Only update HTML if we processed text nodes
            if (result.length > 0) {
                element.html(result.join(''));
            }
        }

        // Check if content is wrapped in p tag
        if (self.find('p').length > 0) {
            // Handle p tags separately
            self.find('p').each(function () {
                wrapWords(jQuery(this));
            });
        } else {
            // Handle non-p tag content
            wrapWords(self);
        }
    });

    const textSplit = new SplitType('.text-split', {
        type: 'lines, chars',
        tagName: 'span'
    });

    const wordSplit = new SplitType('.word-split', {
        type: 'lines, words',
        tagName: 'span'
    });

    const lineSplit = new SplitType('.line-split', {
        type: 'lines',
        tagName: 'span'
    });

    var getInstant = lineSplit.isSplit;
    if (getInstant) {
        jQuery('.line').each(function () {
            jQuery(this).wrap('<span class="line-outer"></span>');
        });
    }

    $('.header-top .header-utilities, .site-navigation').each(function () {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: $(this),
                start: "top bottom",
                end: "bottom center",
                scrub: false,
                toggleActions: "play none play reverse",
            }
        });
        tl.from($(this).find("ul, ul.main-menu"), {
            opacity: 0.01,
            skewX: 0,
            yPercent: -200,
            duration: 1,
            stagger: { amount: 0.1 },
        }, "<");
    });

    $('.wrap-word').each(function () {
        gsap.from($(this).find(".custom-word, .highlight"), {
            opacity: 1,
            skewX: 0,
            yPercent: 100,
            duration: 1,
            stagger: { amount: 0.2 },
            ease: "back.out(2)",
            scrollTrigger: {
                trigger: $(this),
                start: "top 90%",
                end: "bottom 50%",
                scrub: true,
            }
        });
    });

    $(".headline-animation").each(function () {
        var gsapDelay = jQuery(this).attr('data-gsap-delay') || 0;
        gsap.from($(this).find(".line"), {
            opacity: 1,
            skewX: 0,
            yPercent: 100,
            duration: 1,
            stagger: { amount: 0.25 },
            delay: gsapDelay,
            ease: "back.out(2)",
            scrollTrigger: {
                trigger: $(this).find(".line"),
                start: "top 100%",
                end: "bottom 80%",
                scrub: true,
            }
        });
    });

    $(".list-animation").each(function () {
        var gsapDelay = jQuery(this).attr('data-gsap-delay') || 0;

        var animItem;
        if ($(this).find('li').length > 0) {
            animItem = jQuery(this).find('li');
        } else {
            $(this).find(".line");
        }

        gsap.from(animItem, {
            opacity: 0.01,
            skewX: 0,
            yPercent: 200,
            duration: 1,
            stagger: { amount: 0.25 },
            delay: gsapDelay,
            scrollTrigger: {
                trigger: $(this),
                start: "top 100%",
                end: "bottom 70%",
                scrub: true,
            }
        });
    });

    $(".paragraph-animation").each(function () {
        var gsapDelay = jQuery(this).attr('data-gsap-delay') || 0;
        gsap.from($(this).find(".word"), {
            yPercent: 100,
            skewX: 0,
            opacity: 0,
            duration: 1,
            stagger: { amount: 0.5 },
            delay: gsapDelay,
            ease: "back.out(2)",
            scrollTrigger: {
                trigger: $(this),
                start: "top 80%",
                end: "bottom 40%",
                scrub: true,
            }
        });
    });

    $(".fade-in-up").each(function () {
        gsap.from($(this), {
            yPercent: 100,
            opacity: 0,
            duration: 1,
            stagger: { amount: 0.3 },
            scrollTrigger: {
                trigger: $(this),
                start: "top 100%",
                end: "bottom 60%",
                scrub: true,
            }
        });
    });

    $(".fade-in-left").each(function () {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: $(this),
                start: "top bottom",
                end: "bottom top",
                scrub: false,
                toggleActions: "play none play reverse",
            }
        });
        tl.from($(this), {
            xPercent: 40,
            opacity: 0,
            duration: 3,
            stagger: { amount: 0.5 }
        });
    });

    $(".fade-in-right").each(function () {
        var gsapDelay = jQuery(this).attr('data-gsap-delay') || 0;
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: $(this),
                start: "top bottom",
                end: "bottom top",
                scrub: false,
                toggleActions: "play none play reverse",
            }
        });
        tl.from($(this), {
            xPercent: -60,
            opacity: 0,
            duration: 1,
            stagger: { amount: 0.5 },
            delay: gsapDelay
        });
    });

    $(".img-rotate-fade").each(function () {
        var element = jQuery(this);
        gsap.from(element, {
            xPercent: 40,
            rotation: 0,
            transformOrigin: "50% center",
            opacity: 1,
            scrollTrigger: {
                trigger: element,
                start: "top 100%",
                end: "bottom 80%",
                scrub: true,
            }
        });
    });

    $(".belief-sec .section-title").each(function () {
        gsap.from($(this).find('.line > .word .char'), {
            xPercent: -300,
            opacity: 0,
            duration: 1,
            stagger: { amount: 0.5 },
            scrollTrigger: {
                trigger: $(this),
                start: "top 90%",
                end: "bottom 60%",
                scrub: true,
            }
        });
    });

    $(".belief-sec .highlight").each(function () {
        gsap.from($(this), {
            yPercent: 100,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(2)",
            stagger: { amount: 3 },
            scrollTrigger: {
                trigger: $(this),
                start: "top 80%",
                end: "bottom 60%",
                scrub: true,
            }
        });
    });

    $(".btn-icon").each(function () {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: $(this),
                start: "top bottom",
                end: "bottom top",
                scrub: false,
                toggleActions: "play none play reverse",
            }
        });
        tl.from($(this), {
            xPercent: -60,
            opacity: 1,
            duration: 0.3,
            ease: "expoScale(0.5,7,none)",
            stagger: { amount: 0 }
        });
    });

    $(".btn-text").each(function () {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: $(this),
                start: "top bottom",
                end: "bottom top",
                scrub: false,
                toggleActions: "play none play reverse",
            }
        });
        tl.from($(this), {
            xPercent: -1,
            opacity: 1,
            duration: 0.5,
            delay: 0.25,
            ease: "back.out(50)",
            stagger: { amount: 0 }
        });
    });
});


jQuery(document).ready(function ($) {

    //add sticky class on header
    // jQuery(window).on('load scroll', function () {
    //     if (jQuery(this).scrollTop() > 10) {
    //         jQuery('.site-header').addClass('sticky');
    //     } else {
    //         jQuery('.site-header').removeClass('sticky');
    //     }
    // });

    //add animated class on main banner
    setTimeout(function () {
        jQuery('.main-banner').addClass('is-animated');
    }, 700);

    if (jQuery(window).width() > 1023) {
        // Track zoom level
        let zoomLevel = 1;

        // Listen for Ctrl + minus keypress
        jQuery(document).on('keydown', function (e) {

            if ((e.ctrlKey || e.metaKey) && (e.keyCode === 189 || e.keyCode === 109)) {

                // Reduce font size
                let currentSize = parseInt(jQuery('html').css('font-size'));
                let newSize = Math.max(12, Math.round(currentSize * 0.8)); // Don't go below 12px
                jQuery('html').css('--root-font-size', newSize + 'px');
            } else if ((e.ctrlKey || e.metaKey) && (e.keyCode === 48 || e.keyCode === 96)) {
                jQuery('html').css('--root-font-size', '');
            }
        });
    }

    //add transition delay on menu items
    jQuery('.site-navigation ul.main-menu li').each(function (index) {
        const delay = (index * 0.12).toFixed(1);
        jQuery(this).css('--trans-delay', `${delay}s`);
    });

    let submenuTglBtn = jQuery('<button class="submenu-tgl-btn"><i class="fa-solid fa-angle-down"></i></button>');
    jQuery('#nav .menu-item-has-children').find('> a').after(submenuTglBtn);

    jQuery('#nav .submenu-tgl-btn').on('click', function () {
        jQuery(this).toggleClass('active');
        jQuery(this).siblings('.sub-menu').stop(true, false, true).slideToggle();
    });

    //toggle active class on menu toggle btn
    jQuery('.nav_control').on('click', function () {
        jQuery('body').toggleClass('nav_active');
    });

    jQuery('#nav li').on('click', function () {
        jQuery('body').removeClass('nav_active');
    });

    jQuery('#nav li button').on('click', function (e) {
        e.stopPropagation();
    });

    //init swiper
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        effect: "fade",
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            slideChangeTransitionStart: function () {
                // Remove active class from all slides
                jQuery('.cloud-slide').removeClass('active');
            },
            slideChangeTransitionEnd: function () {
                // Add active class to the current slide
                jQuery('.cloud-slide').eq(this.activeIndex).addClass('active');
            },
            init: function () {
                gsap.to(jQuery('.cloud-slide').eq(this.activeIndex), {
                    scrollTrigger: {
                        trigger: jQuery('.cloud-slide').eq(this.activeIndex),
                        start: "top 70%",
                        end: "bottom top",
                        markers: false,
                        onToggle: (self) => {
                            if (self.isActive) {
                                jQuery('.cloud-slide').eq(this.activeIndex).addClass('active');
                            } else {
                                jQuery('.cloud-slide').eq(this.activeIndex).removeClass('active');
                            }
                        },
                    }
                });
            }
        }
    });

}); //document close

jQuery.fn.isOnScreen = function () {

    var win = jQuery(window);

    var viewport = {
        top: win.scrollTop(),
        left: win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

};
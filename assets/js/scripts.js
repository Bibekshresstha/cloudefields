document.fonts.ready.then((fontFaceSet) => {
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
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: $(this),
                start: "top bottom",
                end: "bottom center",
                scrub: false,
                toggleActions: "play none play reverse",
            }
        });
        tl.from($(this).find(".custom-word, .highlight"), {
            opacity: 0.01,
            skewX: 0,
            yPercent: 200,
            duration: 1,
            stagger: { amount: 0.2 },
            delay: 0.3
        }, "<");
    });

    $(".headline-animation").each(function () {
        var gsapDelay = jQuery(this).attr('data-gsap-delay') || 0;
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: $(this),
                start: "top bottom",
                end: "bottom center",
                scrub: false,
                toggleActions: "play none play reverse",
            }
        });
        tl.from($(this).find(".line"), {
            opacity: 0.01,
            skewX: 0,
            yPercent: 200,
            duration: 1,
            stagger: { amount: 0.25 },
            delay: gsapDelay
        }, "<");
    });

    $(".list-animation").each(function () {
        var gsapDelay = jQuery(this).attr('data-gsap-delay') || 0;
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: $(this),
                start: "top bottom",
                end: "bottom center",
                scrub: false,
                toggleActions: "play none play reverse",
            }
        });

        var animItem;
        if ($(this).find('li').length > 0) {
            animItem = jQuery(this).find('li');
        } else {
            $(this).find(".line");
        }

        tl.from(animItem, {
            opacity: 0.01,
            skewX: 0,
            yPercent: 200,
            duration: 1,
            stagger: { amount: 0.25 },
            delay: gsapDelay
        }, "<");
    });

    $(".paragraph-animation").each(function () {
        var gsapDelay = jQuery(this).attr('data-gsap-delay') || 0;
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: $(this),
                start: "top bottom",
                end: "bottom center",
                scrub: false,
                toggleActions: "play none play reverse",
            }
        });
        tl.from($(this).find(".word"), {
            yPercent: 200,
            skewX: 0,
            opacity: 0,
            duration: 1,
            stagger: { amount: 0.5 },
            delay: gsapDelay
        }, "<");
    });

    $(".fade-in-up").each(function () {
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
            yPercent: 100,
            opacity: 0,
            duration: 1,
            stagger: { amount: 0.3 }
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
            xPercent: -40,
            opacity: 0,
            duration: 3,
            stagger: { amount: 0.5 }
        });
    });

    $(".img-rotate-fade").each(function () {
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
            rotation: 0,
            transformOrigin: "50% center",
            opacity: 1,
            duration: 1,
            stagger: { amount: 0.5 }
        });
    });

    $(".belief-sec .section-title").each(function () {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: $(this),
                start: "top bottom",
                end: "bottom top",
                scrub: false,
                toggleActions: "play none play reverse",
            }
        });
        tl.from($(this).find('.line > .word .char'), {
            xPercent: -300,
            opacity: 0,
            duration: 1,
            stagger: { amount: 0.5 }
        });
    });

    $(".belief-sec .highlight").each(function () {
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
            yPercent: 100,
            opacity: 0,
            duration: 0.5,
            delay: 1,
            ease: "back.out(2)",
            stagger: { amount: 3 }
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
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
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
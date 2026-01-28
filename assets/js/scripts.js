document.fonts.ready.then((fontFaceSet) => {

    //init scrollsmoother
    if (jQuery(window).width() > 767) {
        gsap.registerPlugin(ScrollSmoother);
        ScrollSmoother.create({
            wrapper: "#wrapper",
            content: "#wrapper-inn",
        });
    }

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
                start: "top 70%",
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
                start: "top 70%",
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
                start: "top 70%",
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
                start: "top 70%",
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
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: $(this),
                start: "top 70%",
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
                start: "top 70%",
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
            delay: 0.75,
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

    // $(".st0").each(function () {
    //     var gsapDelay = jQuery(this).attr('data-gsap-delay') || 0;
    //     const tl = gsap.timeline({
    //         scrollTrigger: {
    //             trigger: $(this),
    //             start: "top bottom",
    //             end: "bottom top",
    //             scrub: false,
    //             toggleActions: "play none play reverse",
    //         }
    //     });
    //     tl.to($(this), {
    //         opacity: 1,
    //         duration: 2,
    //         delay: gsapDelay,
    //     });
    // });

    // $(".st1").each(function () {
    //     let delayAmt = 0;

    //     for (let i = 0; i < jQuery(this).length; i++) {
    //         delayAmt += 0.25;
    //         jQuery(this).eq(i).attr('data-gsap-delay', delayAmt);
    //     }

    //     var gsapDelay = jQuery(this).attr('data-gsap-delay') || 0;
    //     const tl = gsap.timeline({
    //         scrollTrigger: {
    //             trigger: $(this),
    //             start: "top bottom",
    //             end: "bottom top",
    //             scrub: false,
    //             toggleActions: "play none play reverse",
    //         }
    //     });
    //     tl.from($(this), {
    //         rotation: 60,
    //         yPercent: -100,
    //         xPercent: -100,
    //         opacity: 0,
    //         duration: 1,
    //         stagger: { amount: 0.5 },
    //         delay: gsapDelay,
    //     });
    // });

    // SVG Fill Animation on Scroll
    // Animate filled SVG paths by revealing them from 0% to 100%

    console.log('Initializing SVG fill reveal animations...');

    // Animate all SVG paths in banner decorations
    $(".banner-decor-top svg .decor-bg, .banner-decor-bottom svg .decor-bg").each(function (index) {
        const pathElement = this;

        // Wrap path in a clipPath for animation
        const svg = $(pathElement).closest('svg')[0];
        const pathId = 'path-' + Date.now() + '-' + index;
        const clipPathId = 'clip-' + Date.now() + '-' + index;

        // Set ID on path
        pathElement.setAttribute('id', pathId);

        // Create clipPath element
        const defs = svg.querySelector('defs') || svg.insertBefore(document.createElementNS('http://www.w3.org/2000/svg', 'defs'), svg.firstChild);
        const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', clipPathId);

        // Clone the path for clipping
        const clipPathPath = pathElement.cloneNode(true);
        clipPathPath.removeAttribute('id');
        clipPathPath.removeAttribute('class');
        clipPath.appendChild(clipPathPath);
        defs.appendChild(clipPath);

        // Apply clip-path to original element
        pathElement.style.clipPath = `url(#${clipPathId})`;

        // Set initial state - fully visible (we'll animate the clip path)
        gsap.set(clipPathPath, {
            attr: {
                'stroke-dasharray': function () {
                    const length = clipPathPath.getTotalLength();
                    return length + ' ' + length;
                },
                'stroke-dashoffset': function () {
                    return clipPathPath.getTotalLength();
                }
            },
            stroke: '#FCFDFF',
            strokeWidth: 100,
            fill: 'none'
        });

        // Animate the clip path
        gsap.to(clipPathPath, {
            attr: { 'stroke-dashoffset': 0 },
            duration: 2,
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: $(pathElement).closest('.banner-decor-top, .banner-decor-bottom')[0],
                start: "top 80%",
                end: "bottom 20%",
                scrub: 1,
                markers: false,
                onEnter: () => console.log('Banner SVG fill animation triggered:', index)
            }
        });
    });

    // Animate SVG paths in about section decorations
    $(".about-decor1 svg .decor-bg, .about-decor2 svg .decor-bg").each(function (index) {
        const pathElement = this;

        const svg = $(pathElement).closest('svg')[0];
        const pathId = 'about-path-' + Date.now() + '-' + index;
        const clipPathId = 'about-clip-' + Date.now() + '-' + index;

        pathElement.setAttribute('id', pathId);

        const defs = svg.querySelector('defs') || svg.insertBefore(document.createElementNS('http://www.w3.org/2000/svg', 'defs'), svg.firstChild);
        const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', clipPathId);

        const clipPathPath = pathElement.cloneNode(true);
        clipPathPath.removeAttribute('id');
        clipPathPath.removeAttribute('class');
        clipPath.appendChild(clipPathPath);
        defs.appendChild(clipPath);

        pathElement.style.clipPath = `url(#${clipPathId})`;

        gsap.set(clipPathPath, {
            attr: {
                'stroke-dasharray': function () {
                    const length = clipPathPath.getTotalLength();
                    return length + ' ' + length;
                },
                'stroke-dashoffset': function () {
                    return clipPathPath.getTotalLength();
                }
            },
            stroke: '#FCFDFF',
            strokeWidth: 100,
            fill: 'none'
        });

        gsap.to(clipPathPath, {
            attr: { 'stroke-dashoffset': 0 },
            duration: 2,
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: $(pathElement).closest('.about-decor1, .about-decor2')[0],
                start: "top 80%",
                end: "bottom 20%",
                scrub: 1,
                markers: false,
                onEnter: () => console.log('About SVG fill animation triggered:', index)
            }
        });
    });

    // Animate all other SVG paths
    $("svg .decor-bg").not(".banner-decor-top svg .decor-bg, .banner-decor-bottom svg .decor-bg, .about-decor1 svg .decor-bg, .about-decor2 svg .decor-bg").each(function (index) {
        const pathElement = this;

        const svg = $(pathElement).closest('svg')[0];
        const pathId = 'other-path-' + Date.now() + '-' + index;
        const clipPathId = 'other-clip-' + Date.now() + '-' + index;

        pathElement.setAttribute('id', pathId);

        const defs = svg.querySelector('defs') || svg.insertBefore(document.createElementNS('http://www.w3.org/2000/svg', 'defs'), svg.firstChild);
        const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', clipPathId);

        const clipPathPath = pathElement.cloneNode(true);
        clipPathPath.removeAttribute('id');
        clipPathPath.removeAttribute('class');
        clipPath.appendChild(clipPathPath);
        defs.appendChild(clipPath);

        pathElement.style.clipPath = `url(#${clipPathId})`;

        gsap.set(clipPathPath, {
            attr: {
                'stroke-dasharray': function () {
                    const length = clipPathPath.getTotalLength();
                    return length + ' ' + length;
                },
                'stroke-dashoffset': function () {
                    return clipPathPath.getTotalLength();
                }
            },
            stroke: '#FCFDFF',
            strokeWidth: 100,
            fill: 'none'
        });

        gsap.to(clipPathPath, {
            attr: { 'stroke-dashoffset': 0 },
            duration: 2,
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: $(pathElement).closest('svg')[0],
                start: "top 80%",
                end: "bottom 20%",
                scrub: 1,
                markers: false,
                onEnter: () => console.log('Other SVG fill animation triggered:', index)
            }
        });
    });

    console.log('SVG fill reveal animations initialized');
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
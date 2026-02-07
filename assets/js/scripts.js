document.fonts.ready.then((fontFaceSet) => {

    //register plugins first
    gsap.registerPlugin(MotionPathPlugin);

    //init scrollsmoother
    gsap.registerPlugin(ScrollSmoother);
    ScrollSmoother.create({
        wrapper: "#wrapper",
        content: "#wrapper-inn",
        smooth: 1,
        effects: true, // Disable native effects to prevent initial gaps
        normalizeScroll: false,
        smoothTouch: 0.1,
        ignoreMobileResize: true
    });

    // Custom parallax implementation
    jQuery("[data-speed]").each(function () {
        let speed = parseFloat(jQuery(this).attr("data-speed"));

        // Only apply if speed is different from 1
        if (speed !== 1) {
            let yVal = (1 - speed) * 100;

            // For high speeds, we need to ensure the trigger covers consistent ground
            gsap.fromTo(this, {
                yPercent: 0
            }, {
                yPercent: yVal,
                ease: "none",
                scrollTrigger: {
                    trigger: 'body',
                    start: "clamp(top bottom)",
                    end: "clamp(bottom top)",
                    scrub: 1
                }
            });
        }
    });

    jQuery('.is-sticky').each(function () {
        const $sectionBg = jQuery(this);

        // Store original height once
        const originalHeight = $sectionBg.outerHeight();
        $sectionBg.data('originalHeight', originalHeight);

        // Pre-sticky parallax tween with live height update
        gsap.to($sectionBg, {
            yPercent: -20, // negative or positive
            ease: "none",
            scrollTrigger: {
                trigger: $sectionBg,
                start: "clamp(top 80%)",
                end: "clamp(bottom top)",
                scrub: true,
                markers: false,
                onUpdate: function () {
                    const yPercent = Math.abs(gsap.getProperty($sectionBg[0], "yPercent") || 0);
                    const newHeight = `calc(${originalHeight}px + ${yPercent}%)`;
                    $sectionBg.css({
                        'height': newHeight,
                        'max-height': newHeight
                    });
                }
            }
        });

        // Pin the element
        ScrollTrigger.create({
            trigger: $sectionBg[0],
            start: "top top",
            end: "bottom top",
            pin: $sectionBg[0],
            pinSpacing: false,
            onEnter: function () { $sectionBg.addClass('is-pinned'); },
            onLeave: function () { $sectionBg.removeClass('is-pinned'); },
            onEnterBack: function () { $sectionBg.addClass('is-pinned'); },
            onLeaveBack: function () { $sectionBg.removeClass('is-pinned'); },
            onRefresh: function () {
                // Ensure height is correct on refresh
                const yPercent = Math.abs(gsap.getProperty($sectionBg[0], "yPercent") || 0);
                const newHeight = `calc(${originalHeight}px + ${yPercent}%)`;
                $sectionBg.css({
                    'height': newHeight,
                    'max-height': newHeight
                });
            }
        });

        // Set initial height
        $sectionBg.css('height', originalHeight + 'px');
        $sectionBg.css('max-height', originalHeight + 'px');
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

    gsap.to(".main-banner .banner-item", {
        scrollTrigger: {
            trigger: ".main-banner",
            start: "clamp(top top)",
            end: "clamp(bottom top)",
            scrub: true,
        },
        opacity: 1,
        y: 0,
        ease: "none"
    });

    gsap.to("section[class*='-sec'] > .container-fluid", {
        scrollTrigger: {
            trigger: "section[class*='-sec']",
            start: "clamp(top top)",
            end: "clamp(bottom top)",
            scrub: true,
        },
        opacity: 1,
        y: 0,
        ease: "none"
    });

    jQuery('.main-banner .banner-img img').each(function () {
        var element = jQuery(this);
        gsap.to(element, {
            yPercent: -100,
            duration: 0.5,
            scrollTrigger: {
                trigger: element,
                start: "clamp(top 80%)",
                end: "clamp(bottom top)",
                scrub: true,
            }
        });
    });

    gsap.set("#revealBrush", {
        attr: { r: 0 }
    });

    gsap.to("#revealBrush", {
        attr: { r: 470 },
        ease: "none",
        scrollTrigger: {
            trigger: ".banner-decor-top .decor-bg",
            start: "top 50%",
            end: "bottom 20%",
            scrub: false,
        }
    });

    gsap.set("#revealBrush2", {
        attr: { r: 0 }
    });

    gsap.to("#revealBrush2", {
        attr: { r: 670 },
        ease: "none",
        scrollTrigger: {
            trigger: ".banner-decor-bottom .decor-bg",
            start: "top 87%",
            end: "20% 50%",
            scrub: true,
            markers: false
        }
    });

    const initSectionDecorReveal = () => {
        const svgTargets = document.querySelectorAll(".decor-reveal svg");
        let autoIndex = 0;

        svgTargets.forEach((svg) => {
            if (svg.querySelector("mask")) {
                return;
            }

            const rootGroup = svg.querySelector(":scope > g");
            const viewBox = svg.getAttribute("viewBox");
            if (!rootGroup || !viewBox) {
                return;
            }

            const parts = viewBox.split(/\s+/).map(Number);
            if (parts.length !== 4 || parts.some(Number.isNaN)) {
                return;
            }

            const [, , width, height] = parts;
            const origin = (svg.closest(".decor-reveal")?.getAttribute("data-reveal-origin") || "center").toLowerCase();
            const cx = origin === "left" ? 0 : origin === "right" ? width : width / 2;
            const startCy = 0;
            const endCy = height;
            const maxR = Math.max(
                Math.hypot(cx, height),
                Math.hypot(width - cx, height)
            );
            const maskId = `revealMaskAuto${autoIndex}`;
            const circleId = `revealBrushAuto${autoIndex}`;
            autoIndex += 1;

            const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
            mask.setAttribute("id", maskId);

            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("width", "100%");
            rect.setAttribute("height", "100%");
            rect.setAttribute("fill", "black");

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("id", circleId);
            circle.setAttribute("cx", cx);
            circle.setAttribute("cy", startCy);
            circle.setAttribute("r", 0);
            circle.setAttribute("fill", "white");

            mask.appendChild(rect);
            mask.appendChild(circle);
            defs.appendChild(mask);
            svg.insertBefore(defs, svg.firstChild);

            rootGroup.setAttribute("mask", `url(#${maskId})`);

            const triggerEl = svg.closest(".decor-reveal") || svg;
            gsap.fromTo(circle, {
                attr: { r: 0, cy: startCy }
            }, {
                attr: { r: maxR, cy: endCy },
                ease: "none",
                scrollTrigger: {
                    trigger: triggerEl,
                    start: "top 75%",
                    end: "bottom 20%",
                    scrub: true,
                    markers: false
                }
            });
        });
    };

    initSectionDecorReveal();

    jQuery(".main-banner .banner-decor-top").each(function () {
        var element = jQuery(this);

        gsap.to(element, {
            yPercent: -100,
            duration: 10,
            ease: "none",
            scrollTrigger: {
                trigger: '.main-banner .banner-img',
                start: "clamp(20% 30%)",
                end: "clamp(50% 10%)",
                scrub: true,
            }
        });
    });

    jQuery(".main-banner .banner-decor-bottom").each(function () {
        var element = jQuery(this);

        gsap.to(element, {
            yPercent: -100,
            duration: 5,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "clamp(top 70%)",
                end: "clamp(bottom top)",
                scrub: true,
            }
        });
    });

    jQuery('.about-sec div[class*="about-decor"], .belief-sec .belief-decor4').each(function () {
        var element = jQuery(this);

        gsap.to(element, {
            yPercent: -100,
            duration: 5,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "clamp(top 70%)",
                end: "clamp(200% 10%)",
                scrub: true,
            }
        });
    });

    jQuery('.belief-sec .belief-decor1').each(function () {
        var element = jQuery(this);

        gsap.to(element, {
            yPercent: -100,
            duration: 5,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "top 70%",
                end: "200% 10%",
                scrub: true,
                toggleActions: "play pause none none",
            }
        });
    });

    jQuery('.cloud-sec .cloud-decor1').each(function () {
        var element = jQuery(this);

        gsap.to(element, {
            yPercent: -100,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "clamp(top 150%)",
                end: "clamp(bottom center)",
                scrub: true,
            }
        });
    });

    jQuery('.cloud-sec .cloud-decor2').each(function () {
        var element = jQuery(this);

        gsap.to(element, {
            yPercent: -100,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "clamp(top bottom)",
                end: "clamp(200% 10%)",
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

    jQuery('.header-top .header-utilities, .site-navigation').each(function () {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: jQuery(this),
                start: "top bottom",
                end: "bottom center",
                scrub: false,
                toggleActions: "play none play reverse",
            }
        });
        tl.from(jQuery(this).find("ul, ul.main-menu"), {
            opacity: 0.01,
            skewX: 0,
            yPercent: -200,
            duration: 1,
            stagger: { amount: 0.1 },
        }, "<");
    });

    jQuery('.wrap-word').each(function () {
        gsap.from(jQuery(this).find(".custom-word, .highlight"), {
            opacity: 1,
            skewX: 0,
            yPercent: 100,
            duration: 1,
            stagger: { amount: 0.2 },
            ease: "back.out(2)",
            scrollTrigger: {
                trigger: jQuery(this),
                start: "top 100%",
                end: "+=50%",
                scrub: true,
            }
        });
    });

    jQuery(".headline-animation").each(function () {
        var gsapDelay = jQuery(this).attr('data-gsap-delay') || 0;
        gsap.from(jQuery(this).find(".line"), {
            opacity: 1,
            skewX: 0,
            yPercent: 100,
            duration: 1,
            stagger: { amount: 0.25 },
            delay: gsapDelay,
            ease: "back.out(2)",
            scrollTrigger: {
                trigger: jQuery(this).find(".line"),
                start: "top 100%",
                end: "bottom 80%",
                scrub: true,
            }
        });
    });

    jQuery(".list-animation").each(function () {
        var gsapDelay = jQuery(this).attr('data-gsap-delay') || 0;

        var animItem;
        if (jQuery(this).find('li').length > 0) {
            animItem = jQuery(this).find('li');
        } else {
            animItem = jQuery(this).find(".line");
        }

        gsap.from(animItem, {
            opacity: 0.01,
            skewX: 0,
            yPercent: 200,
            duration: 1,
            stagger: { amount: 0.25 },
            delay: gsapDelay,
            scrollTrigger: {
                trigger: jQuery(this),
                start: "top 100%",
                end: "bottom 70%",
                scrub: true,
            }
        });
    });

    jQuery(".paragraph-animation").each(function () {
        var gsapDelay = jQuery(this).attr('data-gsap-delay') || 0;
        gsap.from(jQuery(this), {
            yPercent: 100,
            skewX: 0,
            opacity: 0,
            duration: 1,
            stagger: { amount: 0.5 },
            delay: gsapDelay,
            ease: "back.out(2)",
            scrollTrigger: {
                trigger: jQuery(this),
                start: "-200% 110%",
                end: "+=50%",
                scrub: true,
            }
        });
    });

    jQuery(".fade-in-up").each(function () {
        gsap.from(jQuery(this), {
            yPercent: 100,
            opacity: 0,
            duration: 1,
            stagger: { amount: 0.3 },
            scrollTrigger: {
                trigger: jQuery(this),
                start: "top 120%",
                end: "bottom 100%",
                scrub: true,
            }
        });
    });

    jQuery(".fade-in-left").each(function () {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: jQuery(this),
                start: "top bottom",
                end: "bottom top",
                scrub: false,
                toggleActions: "play none play reverse",
            }
        });
        tl.from(jQuery(this), {
            xPercent: 40,
            opacity: 0,
            duration: 3,
            stagger: { amount: 0.5 }
        });
    });

    jQuery(".fade-in-right").each(function () {
        var gsapDelay = jQuery(this).attr('data-gsap-delay') || 0;
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: jQuery(this),
                start: "top bottom",
                end: "bottom top",
                scrub: false,
                toggleActions: "play none play reverse",
            }
        });
        tl.from(jQuery(this), {
            xPercent: -60,
            opacity: 0,
            duration: 1,
            stagger: { amount: 0.5 },
            delay: gsapDelay
        });
    });

    jQuery(".img-rotate-fade").each(function () {
        var element = jQuery(this);
        gsap.from(element, {
            xPercent: 40,
            rotation: 0,
            transformOrigin: "50% center",
            scrollTrigger: {
                trigger: element,
                start: "top 100%",
                end: "bottom 80%",
                scrub: true,
            }
        });
    });

    jQuery(".belief-sec .section-title").each(function () {
        gsap.from(jQuery(this).find('.line > .word .char'), {
            xPercent: -300,
            opacity: 0,
            duration: 1,
            stagger: { amount: 0.5 },
            scrollTrigger: {
                trigger: jQuery(this),
                start: "top 90%",
                end: "bottom 60%",
                scrub: true,
            }
        });
    });

    jQuery(".belief-sec .highlight").each(function () {
        gsap.from(jQuery(this), {
            yPercent: 100,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(2)",
            stagger: { amount: 3 },
            scrollTrigger: {
                trigger: jQuery(this),
                start: "top 80%",
                end: "bottom 60%",
                scrub: true,
            }
        });
    });

    jQuery(".btn-icon").each(function () {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: jQuery(this),
                start: "top bottom",
                end: "bottom top",
                scrub: false,
                toggleActions: "play none play reverse",
            }
        });
        tl.from(jQuery(this), {
            xPercent: -60,
            opacity: 1,
            duration: 0.3,
            ease: "expoScale(0.5,7,none)",
            stagger: { amount: 0 }
        });
    });

    jQuery(".btn-text").each(function () {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: jQuery(this),
                start: "top bottom",
                end: "bottom top",
                scrub: false,
                toggleActions: "play none play reverse",
            }
        });
        tl.from(jQuery(this), {
            xPercent: -1,
            opacity: 1,
            duration: 0.5,
            delay: 0.25,
            ease: "back.out(50)",
            stagger: { amount: 0 }
        });
    });
});

jQuery(window).on('load', function () {
    // Force scroll to top on page load
    jQuery(window).scrollTop(0);
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

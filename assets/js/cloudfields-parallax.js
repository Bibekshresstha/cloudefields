/*!
 * Cloudfields Parallax System
 * GSAP + ScrollTrigger + jQuery
 * Production-ready
 */

(function ($) {
    "use strict";

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        console.warn("GSAP or ScrollTrigger missing");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    /* ------------------------------------
       GLOBAL SETTINGS
    ------------------------------------ */

    gsap.defaults({
        ease: "none"
    });

    ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: true
    });

    /* ------------------------------------
       HERO / MAIN BANNER
    ------------------------------------ */

    gsap.to(".banner-img", {
        y: -140,
        scrollTrigger: {
            trigger: ".main-banner",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".banner-img img", {
        rotate: 2,
        scrollTrigger: {
            trigger: ".main-banner",
            scrub: true
        }
    });

    gsap.to(".banner-decor-top", {
        y: -200,
        scrollTrigger: {
            trigger: ".main-banner",
            scrub: true
        }
    });

    gsap.to(".banner-decor-bottom", {
        y: 160,
        scrollTrigger: {
            trigger: ".main-banner",
            scrub: true
        }
    });

    /* ------------------------------------
       SECTION BACKGROUND DRIFT
    ------------------------------------ */

    $(".parallax-section").each(function () {
        gsap.to(this, {
            y: -80,
            scrollTrigger: {
                trigger: this,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    /* ------------------------------------
       ABOUT SECTION DECOR FLOAT
    ------------------------------------ */

    gsap.utils.toArray(".about-sec [class*='decor']").forEach((el, i) => {
        gsap.to(el, {
            y: i % 2 === 0 ? -90 : 90,
            scrollTrigger: {
                trigger: ".about-sec",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // idle floating loop
        gsap.to(el, {
            y: "+=20",
            duration: 3 + i,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });

    /* ------------------------------------
       BELIEF SECTION – REVERSE PARALLAX
    ------------------------------------ */

    gsap.utils.toArray(".belief-sec [class*='decor']").forEach((el) => {
        gsap.fromTo(
            el,
            { y: 120 },
            {
                y: -120,
                scrollTrigger: {
                    trigger: ".belief-sec",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        );
    });

    /* ------------------------------------
       STORY RIBBON / CURVED TEXT
    ------------------------------------ */

    gsap.utils.toArray(".story-ribbon").forEach((ribbon) => {
        gsap.to(ribbon, {
            y: -100,
            scrollTrigger: {
                trigger: ribbon,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6
            }
        });
    });

    /* ------------------------------------
       FLOATING CARD / POLAROID
    ------------------------------------ */

    gsap.fromTo(
        ".floating-card",
        { y: 80 },
        {
            y: -80,
            scrollTrigger: {
                trigger: ".floating-card",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        }
    );

    gsap.to(".floating-card", {
        y: "+=18",
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    /* ------------------------------------
       CLOUD SLIDER IMAGES
    ------------------------------------ */

    gsap.utils.toArray(".cloud-img").forEach((img) => {
        gsap.to(img, {
            y: -60,
            scrollTrigger: {
                trigger: img,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    /* ------------------------------------
       SECTION HEADERS (SAFE REVEAL)
    ------------------------------------ */

    gsap.utils.toArray(".section-header").forEach((header) => {
        gsap.from(header, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: header,
                start: "top 85%",
                once: true
            }
        });
    });

    /* ------------------------------------
       ILLUSTRATIONS (YELLOW SECTION)
    ------------------------------------ */

    gsap.utils.toArray(".illustration").forEach((el) => {
        gsap.fromTo(
            el,
            { y: 60, opacity: 0 },
            {
                y: -40,
                opacity: 1,
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    scrub: true
                }
            }
        );
    });

    /* ------------------------------------
       FOOTER DECOR
    ------------------------------------ */

    gsap.to(".footer-decor", {
        y: -100,
        scrollTrigger: {
            trigger: ".site-footer",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    /* ------------------------------------
       CLEANUP / REFRESH
    ------------------------------------ */

    ScrollTrigger.refresh();

})(jQuery);

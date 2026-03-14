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

    const fitAboutDecorTextPath = (() => {
        let rafId = 0;

        const fitOnce = () => {
            const textPath = document.getElementById("about-decor-txt");
            const pathNode = document.getElementById("about-decor-new-path");
            if (!textPath || !pathNode) return;

            const existingBase = parseFloat(textPath.getAttribute("data-base-font-size"));
            const baseFontSize = Number.isFinite(existingBase)
                ? existingBase
                : parseFloat(getComputedStyle(textPath).fontSize || "16");

            if (!textPath.hasAttribute("data-base-font-size")) {
                textPath.setAttribute("data-base-font-size", String(baseFontSize));
            }

            textPath.style.fontSize = `${baseFontSize}px`;
            textPath.removeAttribute("textLength");
            textPath.removeAttribute("lengthAdjust");

            const textLength = textPath.getComputedTextLength();
            const pathLength = pathNode.getTotalLength();
            if (textLength < 2 || pathLength < 2) return;
            const scale = (pathLength / textLength) * 0.95;

            if (!Number.isFinite(scale) || scale <= 0) return;

            textPath.style.fontSize = `${baseFontSize * scale}px`;
        };

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                rafId = 0;
                fitOnce();
            });
        };
    })();

    fitAboutDecorTextPath();
    window.addEventListener("resize", fitAboutDecorTextPath);
    window.addEventListener("orientationchange", fitAboutDecorTextPath);

    //new svg animation
    jQuery('.about-decor-new svg').each(function() {
        const element = jQuery(this);
        const textPath = element.find("#about-decor-txt");
        const aboutDecor1 = element.find("#about-decor-new-path");
        const pathNode = aboutDecor1.get(0);

        if (!pathNode || textPath.length === 0) return;

        const aboutPathLength = pathNode.getTotalLength();
        gsap.set(pathNode, {
            strokeDasharray: aboutPathLength,
            strokeDashoffset: 0
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                end: "bottom top",
                scrub: true,
            }
        });

        tl.to(textPath, {
            attr: { startOffset: "-100%" },
            ease: "power1",
            duration: 1
        }, 0);

        tl.to(pathNode, {
            strokeDashoffset: aboutPathLength,
            ease: "power1",
            duration: 1
        }, 0);
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

    jQuery('section[class*="-sec"] > .container-fluid').each(function() {
        let self = jQuery(this);
        let parent = self.closest('section[class*="-sec"]');

        gsap.to(self, {
            scrollTrigger: {
                trigger: parent,
                start: "clamp(top 80%)",
                end: "clamp(bottom top)",
                scrub: true,
            },
            opacity: 1,
            y: -25,
            ease: "none"
        });
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

    const revealBrush = document.querySelector("#revealBrush");
    if (revealBrush) {
        const brushTag = revealBrush.tagName.toLowerCase();

        if (brushTag === "path") {
            const pathLength = revealBrush.getTotalLength();

            gsap.set(revealBrush, {
                attr: { fill: "none", stroke: "white" },
                strokeWidth: 150,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength
            });

            let triggerStart;

            if(jQuery(window).width() < 1025){
                triggerStart = "20% 80%";
            } else {
                triggerStart = "top 61%";
            }

            gsap.to(revealBrush, {
                strokeDashoffset: 0,
                duration: 2.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".banner-decor-top .decor-bg",
                    start: triggerStart,
                    toggleActions: "play none none none",
                }
            });
        } else {
            gsap.set(revealBrush, {
                attr: { r: 0, fill: "white" }
            });

            gsap.to(revealBrush, {
                attr: { r: 470 },
                ease: "none",
                scrollTrigger: {
                    trigger: ".banner-decor-top .decor-bg",
                    start: "top 50%",
                    end: "bottom 20%",
                    scrub: false
                }
            });
        }
    }

    const bottomDecorSvg = document.querySelector(".banner-decor-bottom svg");
    const revealBrush2 = bottomDecorSvg ? bottomDecorSvg.querySelector("#revealBrush2") : null;
    if (revealBrush2) {
        const brush2Tag = revealBrush2.tagName.toLowerCase();

        if (brush2Tag === "path") {
            revealBrush2.removeAttribute("transform");
            const pathLength2 = revealBrush2.getTotalLength();

            gsap.set(bottomDecorSvg, { opacity: 0 });
            gsap.set(revealBrush2, {
                attr: { fill: "none", stroke: "white" },
                strokeWidth: 200,
                strokeLinecap: "round",
                strokeDasharray: pathLength2,
                strokeDashoffset: pathLength2
            });

            let triggerStart;
            let triggerEnd;

            if(jQuery(window).width() < 1025){
                triggerStart = "20% 80%";
                triggerEnd = "bottom center";
            } else {
                triggerStart = "20% bottom";
                triggerEnd = "bottom bottom";
            }

            gsap.to(revealBrush2, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".banner-decor-bottom .decor-bg",
                    start: triggerStart,
                    end: triggerEnd,
                    scrub: true,
                    onEnter: () => gsap.to(bottomDecorSvg, { opacity: 1, duration: 0.5, ease: "power1.out" }),
                    onLeaveBack: () => gsap.to(bottomDecorSvg, { opacity: 0, duration: 0.3 }),
                }
            });
        } else {
            gsap.set(revealBrush2, {
                attr: { r: 0, fill: "white" }
            });

            gsap.to(revealBrush2, {
                attr: { r: 670 },
                ease: "none",
                duration: 5,
                scrollTrigger: {
                    trigger: ".banner-decor-bottom .decor-bg",
                    start: "top bottom",
                    end: "bottom 50%",
                    scrub: true,
                    markers: false
                }
            });
        }
    }

    //about decor 1 mask
    // const aboutDecor1Svg = document.querySelector(".about-decor1 svg");
    // const aboutDecor1 = aboutDecor1Svg ? aboutDecor1Svg.querySelector("#aboutBrush1") : null;
    // if (aboutDecor1) {
    //     const aboutbrush1Tag = aboutDecor1.tagName.toLowerCase();

    //     if (aboutbrush1Tag === "path") {
    //         aboutDecor1.removeAttribute("transform");
    //         const aboutpathLength2 = aboutDecor1.getTotalLength();

    //         gsap.set(aboutDecor1Svg, { opacity: 0 });
    //         gsap.set(aboutDecor1, {
    //             attr: { fill: "none", stroke: "white" },
    //             strokeWidth: 200,
    //             strokeLinecap: "round",
    //             strokeDasharray: aboutpathLength2,
    //             strokeDashoffset: aboutpathLength2
    //         });

    //         let triggerStart;
    //         let triggerEnd;

    //         if(jQuery(window).width() < 1025){
    //             triggerStart = "20% center";
    //             triggerEnd = "bottom 30%";
    //         } else {
    //             triggerStart = "20% 95%";
    //             triggerEnd = "bottom bottom";
    //         }

    //         gsap.to(aboutDecor1, {
    //             strokeDashoffset: 0,
    //             ease: "none",
    //             scrollTrigger: {
    //                 trigger: ".about-decor1 .decor-bg",
    //                 start: triggerStart,
    //                 end: triggerEnd,
    //                 scrub: true,
    //                 onEnter: () => gsap.to(aboutDecor1Svg, { opacity: 1, duration: 0.5, ease: "power1.out" }),
    //                 onLeaveBack: () => gsap.to(aboutDecor1Svg, { opacity: 0, duration: 0.3 }),
    //             }
    //         });
    //     } else {
    //         gsap.set(aboutDecor1, {
    //             attr: { r: 0, fill: "white" }
    //         });

    //         gsap.to(aboutDecor1, {
    //             attr: { r: 670 },
    //             ease: "none",
    //             duration: 5,
    //             scrollTrigger: {
    //                 trigger: ".about-decor1 .decor-bg",
    //                 start: "top bottom",
    //                 end: "bottom 50%",
    //                 scrub: true,
    //                 markers: false
    //             }
    //         });
    //     }
    // }

    // //about decor 2 mask
    // const aboutDecor2Svg = document.querySelector(".about-decor2 svg");
    // const aboutDecor2 = aboutDecor2Svg ? aboutDecor2Svg.querySelector("#aboutBrush2") : null;
    // if (aboutDecor2) {
    //     const aboutbrush2Tag = aboutDecor2.tagName.toLowerCase();

    //     if (aboutbrush2Tag === "path") {
    //         aboutDecor2.removeAttribute("transform");
    //         const aboutpathLength2 = aboutDecor2.getTotalLength();

    //         gsap.set(aboutDecor2Svg, { opacity: 0 });
    //         gsap.set(aboutDecor2, {
    //             attr: { fill: "none", stroke: "white" },
    //             strokeWidth: 200,
    //             strokeLinecap: "round",
    //             strokeDasharray: aboutpathLength2,
    //             strokeDashoffset: aboutpathLength2
    //         });

    //         let triggerStart;
    //         let triggerEnd;

    //         if(jQuery(window).width() < 1025){
    //             triggerStart = "60% 30%";
    //             triggerEnd = "bottom 30%";
    //         } else {
    //             triggerStart = "20% 60%";
    //             triggerEnd = "40% center";
    //         }

    //         gsap.to(aboutDecor2, {
    //             strokeDashoffset: 0,
    //             ease: "none",
    //             scrollTrigger: {
    //                 trigger: ".about-decor2 .decor-bg",
    //                 start: triggerStart,
    //                 end: triggerEnd,
    //                 scrub: true,
    //                 onEnter: () => gsap.to(aboutDecor2Svg, { opacity: 1, duration: 0.5, ease: "power1.out" }),
    //                 onLeaveBack: () => gsap.to(aboutDecor2Svg, { opacity: 0, duration: 0.3 }),
    //             }
    //         });
    //     } else {
    //         gsap.set(aboutDecor2, {
    //             attr: { r: 0, fill: "white" }
    //         });

    //         gsap.to(aboutDecor2, {
    //             attr: { r: 670 },
    //             ease: "none",
    //             duration: 5,
    //             scrollTrigger: {
    //                 trigger: ".about-decor2 .decor-bg",
    //                 start: "top bottom",
    //                 end: "bottom 50%",
    //                 scrub: true,
    //                 markers: false
    //             }
    //         });
    //     }
    // }

    // //about decor 3 mask
    // const aboutDecor3Svg = document.querySelector(".about-decor3 svg");
    // const aboutDecor3 = aboutDecor3Svg ? aboutDecor3Svg.querySelector("#aboutBrush3") : null;
    // if (aboutDecor3) {
    //     const aboutbrush3Tag = aboutDecor3.tagName.toLowerCase();

    //     if (aboutbrush3Tag === "path") {
    //         aboutDecor3.removeAttribute("transform");
    //         const aboutpathLength3 = aboutDecor3.getTotalLength();

    //         gsap.set(aboutDecor3Svg, { opacity: 0 });
    //         gsap.set(aboutDecor3, {
    //             attr: { fill: "none", stroke: "white" },
    //             strokeWidth: 200,
    //             strokeLinecap: "round",
    //             strokeDasharray: aboutpathLength3,
    //             strokeDashoffset: aboutpathLength3
    //         });

    //         let triggerStart;
    //         let triggerEnd;

    //         if(jQuery(window).width() < 768){
    //             triggerStart = "20% 80%";
    //             triggerEnd = "center 10%";
    //         } else if(jQuery(window).width() < 1025){
    //             triggerStart = "20% 20%";
    //             triggerEnd = "center 10%";
    //         } else {
    //             triggerStart = "20% 60%";
    //             triggerEnd = "center center";
    //         }

    //         gsap.to(aboutDecor3, {
    //             strokeDashoffset: 0,
    //             ease: "none",
    //             scrollTrigger: {
    //                 trigger: ".about-decor3 .decor-bg",
    //                 start: triggerStart,
    //                 end: triggerEnd,
    //                 scrub: true,
    //                 onEnter: () => gsap.to(aboutDecor3Svg, { opacity: 1, duration: 0.5, ease: "power1.out" }),
    //                 onLeaveBack: () => gsap.to(aboutDecor3Svg, { opacity: 0, duration: 0.3 }),
    //             }
    //         });
    //     } else {
    //         gsap.set(aboutDecor3, {
    //             attr: { r: 0, fill: "white" }
    //         });

    //         gsap.to(aboutDecor3, {
    //             attr: { r: 670 },
    //             ease: "none",
    //             duration: 5,
    //             scrollTrigger: {
    //                 trigger: ".about-decor3 .decor-bg",
    //                 start: "top bottom",
    //                 end: "bottom 50%",
    //                 scrub: true,
    //                 markers: false
    //             }
    //         });
    //     }
    // }

    //about decor 4 mask (belief-decor4)
    const aboutDecor4Svg = document.querySelector(".belief-decor4 svg");
    const aboutDecor4 = aboutDecor4Svg ? aboutDecor4Svg.querySelector("#aboutBrush4") : null;
    if (aboutDecor4) {
        const aboutbrush4Tag = aboutDecor4.tagName.toLowerCase();

        if (aboutbrush4Tag === "path") {
            aboutDecor4.removeAttribute("transform");
            const aboutpathLength4 = aboutDecor4.getTotalLength();
            const aboutDrawLength4 = aboutpathLength4 + 1;

            gsap.set(aboutDecor4Svg, { opacity: 0 });
            gsap.set(aboutDecor4, {
                attr: { fill: "none", stroke: "white" },
                strokeWidth: 200,
                strokeLinecap: "round",
                strokeDasharray: `${aboutDrawLength4} ${aboutDrawLength4}`,
                strokeDashoffset: aboutDrawLength4
            });

            let triggerStart;
            let triggerEnd;

            if(jQuery(window).width() < 768){
                triggerStart = "20% 40%";
                triggerEnd = "bottom 10%";
            } else if(jQuery(window).width() < 1025){
                triggerStart = "20% 37%";
                triggerEnd = "bottom 20%";
            } else {
                triggerStart = "20% 85%";
                triggerEnd = "bottom 80%";
            }

            gsap.fromTo(aboutDecor4, {
                strokeDashoffset: aboutDrawLength4
            }, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".belief-decor4 .decor-bg",
                    start: triggerStart,
                    end: triggerEnd,
                    scrub: true,
                    onEnter: () => gsap.to(aboutDecor4Svg, { opacity: 1, duration: 0.5, ease: "power1.out" }),
                    onEnterBack: () => gsap.to(aboutDecor4Svg, { opacity: 1, duration: 0.2, overwrite: "auto" }),
                    onLeaveBack: () => gsap.to(aboutDecor4Svg, { opacity: 0, duration: 0.3 }),
                }
            });
        } else {
            gsap.set(aboutDecor4, {
                attr: { r: 0, fill: "white" }
            });

            gsap.to(aboutDecor4, {
                attr: { r: 670 },
                ease: "none",
                duration: 5,
                scrollTrigger: {
                    trigger: ".belief-decor4 .decor-bg",
                    start: "top bottom",
                    end: "bottom 50%",
                    scrub: true,
                    markers: false
                }
            });
        }
    }

    //belief decor 1 mask
    const beliefDecor1Svg = document.querySelector(".belief-decor1 svg");
    const beliefDecor1 = beliefDecor1Svg ? beliefDecor1Svg.querySelector("#beliefBrush1") : null;
    if (beliefDecor1) {
        const beliefbrush1Tag = beliefDecor1.tagName.toLowerCase();

        if (beliefbrush1Tag === "path") {
            beliefDecor1.removeAttribute("transform");
            const beliefpathLength1 = 3000;

            gsap.set(beliefDecor1Svg, { opacity: 0 });
            gsap.set(beliefDecor1, {
                attr: { fill: "none", stroke: "white" },
                strokeWidth: 200,
                strokeLinecap: "round",
                strokeDasharray: beliefpathLength1,
                strokeDashoffset: beliefpathLength1
            });

            let triggerStart;
            let triggerEnd;

            if(jQuery(window).width() < 768){
                triggerStart = "top 33%";
                triggerEnd = "bottom 20%";
            } else if(jQuery(window).width() < 1025){
                triggerStart = "top 35%";
                triggerEnd = "bottom top";
            } else {
                triggerStart = "top 85%";
                triggerEnd = "bottom 20%";
            }

            gsap.to(beliefDecor1, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".belief-decor1 .decor-bg",
                    start: triggerStart,
                    end: triggerEnd,
                    scrub: true,
                    onEnter: () => gsap.to(beliefDecor1Svg, { opacity: 1, duration: 0.5, ease: "power1.out" }),
                    onLeaveBack: () => gsap.to(beliefDecor1Svg, { opacity: 0, duration: 0.3 }),
                }
            });
        } else {
            gsap.set(beliefDecor1, {
                attr: { r: 0, fill: "white" }
            });

            gsap.to(beliefDecor1, {
                attr: { r: 670 },
                ease: "none",
                duration: 5,
                scrollTrigger: {
                    trigger: ".belief-decor1 .decor-bg",
                    start: "top bottom",
                    end: "bottom 50%",
                    scrub: true,
                    markers: false
                }
            });
        }
    }

    //cloud decor 1 mask
    const cloudDecor1Svg = document.querySelector(".cloud-decor1 svg");
    const cloudDecor1 = cloudDecor1Svg ? cloudDecor1Svg.querySelector("#cloudBrush1") : null;
    if (cloudDecor1) {
        const cloudbrush1Tag = cloudDecor1.tagName.toLowerCase();

        if (cloudbrush1Tag === "path") {
            cloudDecor1.removeAttribute("transform");
            const cloudpathLength1 = cloudDecor1.getTotalLength();

            gsap.set(cloudDecor1Svg, { opacity: 0 });
            gsap.set(cloudDecor1, {
                attr: { fill: "none", stroke: "white" },
                strokeWidth: 200,
                strokeLinecap: "round",
                strokeDasharray: cloudpathLength1,
                strokeDashoffset: cloudpathLength1
            });

            let triggerStart;
            let triggerEnd;

            if(jQuery(window).width() < 1025){
                triggerStart = "85% 72%";
                triggerEnd = "bottom 10%";
            } else {
                triggerStart = "75% 90%";
                triggerEnd = "bottom center";
            }

            gsap.to(cloudDecor1, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".cloud-decor1 .decor-bg",
                    start: triggerStart,
                    end: triggerEnd,
                    scrub: true,
                    onEnter: () => gsap.to(cloudDecor1Svg, { opacity: 1, duration: 0.5, ease: "power1.out" }),
                    onLeaveBack: () => gsap.to(cloudDecor1Svg, { opacity: 0, duration: 0.3 }),
                }
            });
        } else {
            gsap.set(cloudDecor1, {
                attr: { r: 0, fill: "white" }
            });

            gsap.to(cloudDecor1, {
                attr: { r: 670 },
                ease: "none",
                duration: 5,
                scrollTrigger: {
                    trigger: ".cloud-decor1 .decor-bg",
                    start: "top bottom",
                    end: "bottom 50%",
                    scrub: true,
                    markers: false
                }
            });
        }
    }

    //cloud decor 2 mask
    const cloudDecor2Svg = document.querySelector(".cloud-decor2 svg");
    const cloudDecor2 = cloudDecor2Svg ? cloudDecor2Svg.querySelector("#cloudBrush2") : null;
    if (cloudDecor2) {
        const cloudbrush2Tag = cloudDecor2.tagName.toLowerCase();

        if (cloudbrush2Tag === "path") {
            cloudDecor2.removeAttribute("transform");
            const cloudpathLength2 = cloudDecor2.getTotalLength();

            gsap.set(cloudDecor2Svg, { opacity: 0 });
            gsap.set(cloudDecor2, {
                attr: { fill: "none", stroke: "white" },
                strokeWidth: 320,
                strokeLinecap: "round",
                strokeDasharray: cloudpathLength2,
                strokeDashoffset: cloudpathLength2
            });

            let triggerStart;
            let triggerEnd;

            if(jQuery(window).width() < 768){
                triggerStart = "20% 63%";
                triggerEnd = "bottom 20%";
            } else if(jQuery(window).width() < 1025){
                triggerStart = "20% 35%";
                triggerEnd = "bottom 20%";
            } else {
                triggerStart = "20% 80%";
                triggerEnd = "bottom center";
            }

            gsap.to(cloudDecor2, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".cloud-decor2 .decor-bg",
                    start: triggerStart,
                    end: triggerEnd,
                    scrub: true,
                    onEnter: () => gsap.to(cloudDecor2Svg, { opacity: 1, duration: 0.5, ease: "power1.out" }),
                    onLeaveBack: () => gsap.to(cloudDecor2Svg, { opacity: 0, duration: 0.3 }),
                }
            });
        } else {
            gsap.set(cloudDecor2, {
                attr: { r: 0, fill: "white" }
            });

            gsap.to(cloudDecor2, {
                attr: { r: 670 },
                ease: "none",
                duration: 5,
                scrollTrigger: {
                    trigger: ".cloud-decor2 .decor-bg",
                    start: "top bottom",
                    end: "bottom 50%",
                    scrub: true,
                    markers: false
                }
            });
        }
    }

    const initSectionDecorReveal = () => {
        const svgTargets = document.querySelectorAll("body:not(.index-about) .decor-reveal svg");
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
            const decorEl = svg.closest(".decor-reveal");
            const origin = (decorEl?.getAttribute("data-reveal-origin") || "center").toLowerCase();
            const initialXAttr = decorEl?.getAttribute("data-initial-x");
            const initialYAttr = decorEl?.getAttribute("data-initial-y");
            const initialX = initialXAttr !== null ? parseFloat(initialXAttr) : NaN;
            const initialY = initialYAttr !== null ? parseFloat(initialYAttr) : NaN;
            const cx = origin === "left" ? 0 : origin === "right" ? width : width / 2;
            const startCx = Number.isFinite(initialX) ? initialX : cx;
            const startCy = Number.isFinite(initialY) ? initialY : 0;
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
            circle.setAttribute("cx", startCx);
            circle.setAttribute("cy", startCy);
            circle.setAttribute("r", 0);
            circle.setAttribute("fill", "white");

            mask.appendChild(rect);
            mask.appendChild(circle);
            defs.appendChild(mask);
            svg.insertBefore(defs, svg.firstChild);

            rootGroup.setAttribute("mask", `url(#${maskId})`);

            const triggerEl = decorEl || svg;
            const scrollStart = triggerEl.getAttribute("data-scroll-start") || "top 75%";
            const scrollEnd = triggerEl.getAttribute("data-scroll-end") || "bottom 20%";
            gsap.fromTo(circle, {
                attr: { r: 0, cx: startCx, cy: startCy }
            }, {
                attr: { r: maxR, cx: cx, cy: endCy },
                ease: "none",
                scrollTrigger: {
                    trigger: triggerEl,
                    start: scrollStart,
                    end: scrollEnd,
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
            yPercent: -25,
            duration: 50,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "top 70%",
                end: "10% 60%",
                scrub: true,
                toggleActions: "play pause none none"
            }
        });
    });

    // jQuery('.about-sec div[class*="about-decor"]').each(function () {
    //     var element = jQuery(this);

    //     gsap.to(element, {
    //         yPercent: -100,
    //         duration: 5,
    //         ease: "none",
    //         scrollTrigger: {
    //             trigger: element,
    //             start: "clamp(top 80%)",
    //             end: "clamp(200% 10%)",
    //             scrub: true,
    //         }
    //     });
    // });

    // jQuery('.belief-sec .belief-decor1').each(function () {
    //     var element = jQuery(this);

    //     gsap.to(element, {
    //         yPercent: -100,
    //         duration: 5,
    //         ease: "none",
    //         scrollTrigger: {
    //             trigger: element,
    //             start: "top 70%",
    //             end: "200% 10%",
    //             scrub: true,
    //             toggleActions: "play pause none none",
    //         }
    //     });
    // });

    // jQuery('.cloud-sec .cloud-decor1').each(function () {
    //     var element = jQuery(this);

    //     gsap.to(element, {
    //         yPercent: -100,
    //         ease: "none",
    //         scrollTrigger: {
    //             trigger: element,
    //             start: "clamp(top 150%)",
    //             end: "clamp(bottom center)",
    //             scrub: true,
    //         }
    //     });
    // });

    // jQuery('.cloud-sec .cloud-decor2').each(function () {
    //     var element = jQuery(this);

    //     gsap.to(element, {
    //         yPercent: -100,
    //         ease: "none",
    //         scrollTrigger: {
    //             trigger: element,
    //             start: "clamp(top bottom)",
    //             end: "clamp(200% 10%)",
    //             scrub: true,
    //         }
    //     });
    // });

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
        jQuery('.main-banner, body:not(.home) .logo').addClass('is-animated');
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

    // JS-driven SVG draw animation (works for inline SVG only)
    (function initHeroBannerDecor2MaskDraw() {
        const basePath = document.querySelector('#hero-banner-decor2-mask-path');
        if (!basePath || !basePath.parentNode) return;

        const drawPath = basePath.cloneNode(false);
        drawPath.removeAttribute('id');
        drawPath.setAttribute('fill', 'none');
        drawPath.setAttribute('stroke', '#FCFDFF');
        drawPath.setAttribute('stroke-width', '4');
        drawPath.setAttribute('stroke-linecap', 'round');
        drawPath.setAttribute('stroke-linejoin', 'round');
        drawPath.setAttribute('aria-hidden', 'true');
        basePath.parentNode.appendChild(drawPath);

        const totalLength = drawPath.getTotalLength();
        drawPath.style.strokeDasharray = totalLength;
        drawPath.style.strokeDashoffset = totalLength;

        gsap.to(drawPath, {
            strokeDashoffset: 0,
            duration: 3,
            ease: 'power2.out'
        });
    })();

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

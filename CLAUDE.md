# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JavaScript marketing website for Cloudfields (ice cream brand). No build system, package manager, or framework — pure vanilla JS + GSAP served as static files.

## Development

No build step required. Open HTML files directly in a browser or serve with any static server:

```bash
# Using PHP (available via Laravel Herd):
php -S localhost:8000

# Using Python:
python3 -m http.server 8000
```

No linting, testing, or CI configuration exists in this project.

## File Structure

- **`index-new.html`** — Current active development version (most recent)
- **`index.html` / `index2.html`** — Older versions kept for reference
- **`index-snake.html`, `snake-*.html`, `test-snake-scroll.html`** — Prototype/demo pages for isolating animation experiments
- **`style.css`** — Global stylesheet (custom fonts, layout, responsive)
- **`assets/js/scripts.js`** — Main animation engine (967 lines); initializes ScrollSmoother, parallax, sticky backgrounds, opacity fades, SVG stroke reveals, and decor mask animations
- **`assets/js/cloudfields-parallax.js`** — Desktop-only parallax and rotation effects; disables on `< 768px`
- **`assets/js/snake-reveal.js`** — Snake text-along-path animation; fetches SVG files dynamically, uses ScrollTrigger for progressive reveal; Firefox disables distortion maps
- **`assets/js/stickyScrollBlock.js`** — jQuery plugin for container-relative sticky elements

## Key Architecture Patterns

**Animation stack:** GSAP core + ScrollTrigger + ScrollSmoother + MotionPathPlugin (all local minified files in `assets/js/`). jQuery is used for DOM manipulation in older code; newer files use vanilla JS.

**Parallax system:** Elements use `data-speed` attributes. `cloudfields-parallax.js` handles desktop-only parallax; `scripts.js` handles global GSAP-based scroll speed assignments.

**SVG masks/decorations:** Decorative elements (e.g., `about-decor1`–`4`, `belief-decor`, `cloud-decor`) use SVG clip-path masks animated via ScrollTrigger. Each decor has a corresponding SVG mask file in `assets/images/`.

**Snake animation:** `snake-reveal.js` dynamically fetches an SVG path file, appends text along the path, then animates `stroke-dashoffset` as the user scrolls. Responsive sizing uses `90vw`.

**Breakpoints:** Mobile at `700px` and `768px`.

## Workflow Notes

- `index-new.html` is the working file; changes should happen there first
- Demo HTML files in root are used for isolated animation experiments — not production pages
- All dependency JS/CSS files are vendored locally under `assets/` (no CDN dependencies)

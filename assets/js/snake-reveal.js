(() => {
  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const setupSnakeReveal = async () => {
    const [pathPrimarySvg, pathBackupSvg, strokeSvg] = await Promise.all([
      fetch('assets/images/snake-animation-path.svg').then((res) => res.text()),
      fetch('assets/images/snake-path.svg').then((res) => res.text()),
      fetch('assets/images/snake-decor-stroke.svg').then((res) => res.text())
    ]);

    const parser = new DOMParser();
    const pathPrimaryDoc = parser.parseFromString(pathPrimarySvg, 'image/svg+xml');
    const pathBackupDoc = parser.parseFromString(pathBackupSvg, 'image/svg+xml');
    const strokeDoc = parser.parseFromString(strokeSvg, 'image/svg+xml');

    const motionPathPrimary = pathPrimaryDoc.querySelector('path');
    const motionPathBackup = pathBackupDoc.querySelector('path');
    const requestedPath = new URLSearchParams(window.location.search).get('path');
    let motionPath = motionPathPrimary || motionPathBackup;
    if (requestedPath === 'backup' && motionPathBackup) motionPath = motionPathBackup;

    const host = document.getElementById('snakeRevealHost');
    const textPath = document.getElementById('snakeRevealTextPath');
    const textBand = document.getElementById('snakeRevealTextBand');
    const textLayer = document.getElementById('snakeRevealTextLayer');
    const strokeRoot = strokeDoc.querySelector('svg');
    const strokePath = strokeRoot ? (strokeRoot.querySelector('.st1-bg') || strokeRoot.querySelector('path')) : null;
    const textNodes = Array.from(document.querySelectorAll('#snakeRevealTextLayer textPath'));
    const distortionNodes = Array.from(document.querySelectorAll('#snakeRevealDistort feDisplacementMap'));

    if (!motionPath || !host || !textPath || !textBand || textNodes.length === 0) {
      console.error('Snake reveal: required nodes not found.');
      return;
    }

    const motionD = motionPath.getAttribute('d') || '';
    textPath.setAttribute('d', motionD);
    textBand.setAttribute('d', motionD);
    host.innerHTML = '';
    if (strokeRoot && strokePath) {
      strokePath.classList.add('snake-guide');
      host.appendChild(strokeRoot);
    } else {
      const fallbackGuide = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      fallbackGuide.setAttribute('viewBox', '0 0 1706.1 3750.7');
      const fallbackPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      fallbackPath.setAttribute('d', motionD);
      fallbackPath.setAttribute('class', 'snake-guide');
      fallbackGuide.appendChild(fallbackPath);
      host.appendChild(fallbackGuide);
    }

    if (isFirefox) {
      distortionNodes.forEach((node) => node.setAttribute('scale', '0'));
    }

    const sectionStart = document.querySelector('.main-banner');
    const sectionEnd = document.querySelector('.cloud-sec');
    const scrollRoot = document.documentElement;
    if (!sectionStart || !sectionEnd) {
      console.error('Snake reveal: .about-sec or .cloud-sec is missing.');
      return;
    }

    let scrollStart = 0;
    let scrollEnd = 1;
    let offsetStart = 0;
    let lastY = window.scrollY;
    let speed = 0;
    let rafId = null;

    const middleGap = '\u00A0'.repeat(24);
    const fullText = `AT CLOUDFIELDS${middleGap}WE BELIEVE ICE CREAM IS MORE THAN A TREAT IT'S A SPACE FOR IMAGINATION A PLACE WHERE CRAFT AND CREATIVITY MEET WHERE FLAVOURS ARE EXPLORED WITH INTENTION AND WHERE JOY IS DESIGNED INTO EVERY DETAIL. EVERY CLOUDFIELDS CREATION IS THOUGHTFULLY CRAFTED FROM THE BALANCE OF FLAVOURS TO THE SHAPE IT TAKES IN YOURS HANDS.`;

    const totalLen = motionPath.getTotalLength();
    const delta = Math.max(1, totalLen / 1500);
    const samples = 1600;
    let bestLen = 0;
    let bestY = Number.POSITIVE_INFINITY;
    for (let i = 0; i <= samples; i += 1) {
      const len = (totalLen * i) / samples;
      const p = motionPath.getPointAtLength(len);
      const pNext = motionPath.getPointAtLength(Math.min(totalLen, len + delta));
      if (pNext.y >= p.y && p.y < bestY) {
        bestY = p.y;
        bestLen = len;
      }
    }
    if (!Number.isFinite(bestY)) {
      for (let i = 0; i <= samples; i += 1) {
        const len = (totalLen * i) / samples;
        const p = motionPath.getPointAtLength(len);
        if (p.y < bestY) {
          bestY = p.y;
          bestLen = len;
        }
      }
    }
    offsetStart = (bestLen / totalLen) * 100;

    const updateBounds = () => {
      const viewH = window.innerHeight;
      const startRect = sectionStart.getBoundingClientRect();
      const endRect = sectionEnd.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      scrollStart = startRect.top + scrollTop - viewH * 0.2;
      scrollEnd = endRect.top + scrollTop + Math.max(endRect.height - viewH, 1) + viewH * 0.15;
      const maxScroll = Math.max(scrollRoot.scrollHeight - viewH, 1);
      scrollEnd = Math.min(scrollEnd, maxScroll);
      if (scrollEnd <= scrollStart) scrollEnd = scrollStart + viewH;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const deltaY = currentY - lastY;
        speed = 0.85 * speed + 0.15 * Math.abs(deltaY);
        lastY = currentY;

        const progress = clamp((currentY - scrollStart) / (scrollEnd - scrollStart), 0, 1);
        let revealProgress = 0;
        if (progress <= 0.4) {
          revealProgress = progress;
        } else if (progress <= 0.6) {
          revealProgress = 0.4 + (progress - 0.4) * 1.5;
        } else {
          revealProgress = 0.6 + (progress - 0.6) * 0.7;
        }
        revealProgress = clamp(revealProgress, 0, 1);

        const inRange = currentY >= scrollStart;
        const visibleChars = inRange ? Math.max(1, Math.floor(fullText.length * revealProgress)) : 0;
        textLayer.style.opacity = visibleChars > 0 ? '0.92' : '0';
        const visibleText = fullText.slice(0, visibleChars);
        textNodes.forEach((node) => {
          node.setAttribute('startOffset', `${offsetStart}%`);
          node.removeAttribute('lengthAdjust');
          node.removeAttribute('textLength');
          node.textContent = visibleText;
        });

        if (!isFirefox && distortionNodes.length) {
          const scale = clamp(speed * 0.15, 0, 18);
          distortionNodes.forEach((node) => node.setAttribute('scale', scale.toFixed(2)));
        }

        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateBounds();
      onScroll();
    });
    updateBounds();
    onScroll();
  };

  setupSnakeReveal().catch((error) => {
    console.error('Snake reveal: setup failed.', error);
  });
})();

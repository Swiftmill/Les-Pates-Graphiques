(function () {
  const glyphContainerId = 'glyph-controls';
  const revealIntervals = new WeakMap();
  const returnTimers = new WeakMap();
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = reduceMotionQuery.matches;
  let activeVideoIndex = 0;

  document.addEventListener('DOMContentLoaded', () => {
    initHero();
    initCursor();
    initGlyphs();
    initSmoothScroll();
    if (prefersReducedMotion) {
      applyReducedMotion();
    }
  });

  reduceMotionQuery.addEventListener('change', (event) => {
    prefersReducedMotion = event.matches;
    if (prefersReducedMotion) {
      applyReducedMotion();
    } else {
      removeReducedMotion();
    }
  });

  function applyReducedMotion() {
    document.body.classList.add('reduced-motion');
    if ('scrollBehavior' in document.documentElement.style) {
      document.documentElement.style.scrollBehavior = '';
    }
    document.querySelectorAll('video.bg').forEach((video) => {
      video.pause();
      video.removeAttribute('autoplay');
    });
  }

  function removeReducedMotion() {
    document.body.classList.remove('reduced-motion');
    if ('scrollBehavior' in document.documentElement.style) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
    document.querySelectorAll('video.bg').forEach((video) => {
      if (typeof video.play === 'function') {
        video.play().catch(() => {});
      }
    });
  }

  function initHero() {
    const heroTitle = document.getElementById('hero-title');
    const heroSection = document.querySelector('.hero');
    const videos = document.querySelectorAll('.video-wrapper video.bg');

    if (heroTitle) {
      heroTitle.setAttribute('data-glitch', 'LES PÂTES GRAPHIQUES');
      heroTitle.addEventListener('click', () => swapBackground(heroSection, videos));
      heroTitle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          swapBackground(heroSection, videos);
        }
      });
      heroTitle.setAttribute('tabindex', '0');
      heroTitle.setAttribute('role', 'button');
      heroTitle.setAttribute('aria-label', 'Alterner la sauce vidéo');
    }
  }

  function initCursor() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;

    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (coarsePointer) {
      cursor.style.display = 'none';
      return;
    }

    document.addEventListener('mousemove', (event) => {
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    });

    document.addEventListener('mousedown', () => cursor.classList.add('active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('active'));

    const interactiveSelectors = 'button, a, input, textarea, label';
    document.addEventListener('mouseover', (event) => {
      if (event.target.closest(interactiveSelectors)) {
        cursor.classList.add('active');
      }
    });

    document.addEventListener('mouseout', (event) => {
      if (event.target.closest(interactiveSelectors)) {
        cursor.classList.remove('active');
      }
    });
  }

  function initSmoothScroll() {
    const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    if (!supportsSmoothScroll || prefersReducedMotion) {
      return;
    }

    document.documentElement.style.scrollBehavior = 'smooth';
  }

  function initGlyphs() {
    const container = document.getElementById(glyphContainerId);
    if (!container) return;

    fetch('assets/data/glyphs.json')
      .then((response) => response.json())
      .then((glyphSets) => {
        glyphSets.forEach((set) => {
          const button = document.createElement('button');
          button.className = 'glyph';
          button.type = 'button';
          button.dataset.target = set.id;
          button.dataset.realText = set.real;
          button.setAttribute('aria-label', set.real);
          button.textContent = set.glyphs?.[0] || '卄';
          container.appendChild(button);

          const cycler = window.GlyphEngine?.createGlyphCycler(button, set.glyphs || []);

          const onReveal = () => {
            if (!cycler) return;
            clearReturnTimer(button);
            clearRevealInterval(button);
            cycler.stop();
            revealText(button, set.real);
          };

          const onReset = () => {
            if (!cycler) return;
            clearReturnTimer(button);
            clearRevealInterval(button);
            const scheduler = window.GlyphEngine?.scheduleReturn || window.setTimeout;
            const delay = window.GlyphEngine?.constants?.RETURN_DELAY_MS ?? 500;
            const timer = scheduler(() => {
              cycler.start();
            }, delay);
            returnTimers.set(button, timer);
          };

          button.addEventListener('mouseenter', onReveal);
          button.addEventListener('focus', onReveal);
          button.addEventListener('mouseleave', onReset);
          button.addEventListener('blur', onReset);
          button.addEventListener('click', (event) => {
            event.preventDefault();
            scrollToSection(set.id);
          });
        });
      })
      .catch((error) => {
        console.error('Impossible de charger les glyphes :', error);
      });
  }

  function clearReturnTimer(button) {
    const existingTimer = returnTimers.get(button);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
      returnTimers.delete(button);
    }
  }

  function clearRevealInterval(button) {
    const existingInterval = revealIntervals.get(button);
    if (existingInterval) {
      window.clearInterval(existingInterval);
      revealIntervals.delete(button);
    }
  }

  function revealText(button, realText) {
    const constants = window.GlyphEngine?.constants;
    const revealRate = constants ? constants.REVEAL_RATE_MS : 15;

    clearRevealInterval(button);

    button.textContent = '';
    const characters = Array.from(realText);
    let index = 0;

    const interval = window.setInterval(() => {
      button.textContent += characters[index];
      index += 1;
      if (index >= characters.length) {
        window.clearInterval(interval);
      }
    }, revealRate);

    revealIntervals.set(button, interval);
  }

  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;

    if (prefersReducedMotion) {
      target.scrollIntoView();
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function swapBackground(heroSection, videos) {
    if (!videos || videos.length === 0 || !heroSection) return;

    heroSection.classList.remove('swap-flash');
    void heroSection.offsetWidth;

    const nextIndex = (activeVideoIndex + 1) % videos.length;
    videos.forEach((video, index) => {
      video.classList.toggle('is-active', index === nextIndex);
    });

    activeVideoIndex = nextIndex;
    heroSection.classList.add('swap-flash');
  }

  window.initGlyphs = initGlyphs;
  window.revealText = revealText;
  window.swapBackground = swapBackground;
})();

(function () {
  const GLYPH_RATE_MS = 80;
  const REVEAL_RATE_MS = 15;
  const RETURN_DELAY_MS = 500;

  function createGlyphCycler(button, glyphs) {
    let index = 0;
    let intervalId = null;

    function tick() {
      if (!glyphs.length) {
        button.textContent = '';
        return;
      }
      button.textContent = glyphs[index % glyphs.length];
      index += 1;
    }

    function start() {
      stop();
      tick();
      intervalId = window.setInterval(tick, GLYPH_RATE_MS);
    }

    function stop() {
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    }

    start();

    return {
      start,
      stop,
    };
  }

  function scheduleReturn(callback, delay = RETURN_DELAY_MS) {
    return window.setTimeout(callback, delay);
  }

  window.GlyphEngine = {
    createGlyphCycler,
    scheduleReturn,
    constants: {
      GLYPH_RATE_MS,
      REVEAL_RATE_MS,
      RETURN_DELAY_MS,
    },
  };
})();

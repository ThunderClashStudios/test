/* ==========================================================================
   PRO STRIKER — SITE GLUE (fullscreen button only)
   --------------------------------------------------------------------------
   This file does not implement fullscreen logic itself. The game already
   has a fullscreen system in js/input.js:
     - fsSupported()      → whether this browser/device can go fullscreen
     - toggleFullscreen()  → enters/exits fullscreen on document.documentElement
     - isFs()               → whether fullscreen is currently active
   Those are left completely untouched. This file only wires the site's
   external "Fullscreen" button to that existing global function, and
   listens for the browser's fullscreenchange event to (a) swap the
   button's label/icon and (b) add an `is-fullscreen` class to <html> as a
   belt-and-braces fallback for browsers whose `:fullscreen` CSS pseudo-
   class support is inconsistent — site.css hides the website chrome via
   both `:fullscreen` and `.is-fullscreen`.
   ========================================================================== */
(function () {
    function isDocFullscreen() {
        return !!(document.fullscreenElement || document.webkitFullscreenElement);
    }

    function syncFullscreenUI() {
        var active = isDocFullscreen();
        document.documentElement.classList.toggle('is-fullscreen', active);
        var btn = document.getElementById('siteFsToggle');
        if (!btn) return;
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        var label = btn.querySelector('.fs-label');
        if (label) label.textContent = active ? 'Exit Fullscreen' : 'Fullscreen';
    }

    document.addEventListener('fullscreenchange', syncFullscreenUI);
    document.addEventListener('webkitfullscreenchange', syncFullscreenUI);

    function init() {
        var btn = document.getElementById('siteFsToggle');
        if (!btn) return;

        // Mirror the same support check the game's own in-canvas fullscreen
        // button uses (fsSupported() in js/input.js), without depending on
        // its internal implementation ever staying identical: if it isn't
        // present for any reason, fall back to an equivalent inline check
        // rather than throwing.
        var supported = typeof window.fsSupported === 'function'
            ? window.fsSupported()
            : !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen) &&
              !/iPhone|iPod/.test(navigator.userAgent);

        if (!supported) {
            btn.style.display = 'none';
            return;
        }

        btn.addEventListener('click', function () {
            if (typeof window.toggleFullscreen === 'function') window.toggleFullscreen();
        });

        syncFullscreenUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

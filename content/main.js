/**
 * Navis - Main Entry Point
 * Detects the platform and initializes the minimap.
 */

(function () {
  "use strict";

  // Prevent double initialization
  if (window.__navisInitialized) return;
  window.__navisInitialized = true;

  const platformName = NavisPlatforms.detectPlatform();
  if (!platformName) {
    console.log("[Navis] Platform not supported:", window.location.hostname);
    return;
  }

  const platform = NavisPlatforms.getPlatform(platformName);
  if (!platform) return;

  console.log(`[Navis] Detected platform: ${platform.name}`);

  // Wait for the chat container to appear before initializing
  function waitForChat(retries = 30) {
    const chatContainer = platform.getChatContainer();
    if (chatContainer) {
      console.log("[Navis] Chat container found. Initializing minimap...");
      NavisMinimap.init(platform);
    } else if (retries > 0) {
      setTimeout(() => waitForChat(retries - 1), 1000);
    } else {
      console.log("[Navis] Chat container not found after retries. Will retry on navigation.");
      // Keep watching for SPA navigation
      watchForNavigation();
    }
  }

  /**
   * Watch for SPA navigation changes (URL changes without page reload).
   */
  function watchForNavigation() {
    let lastUrl = location.href;

    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log("[Navis] Navigation detected, re-checking for chat...");
        // Reset and try again
        window.__navisInitialized = false;
        NavisMinimap.destroy();
        setTimeout(() => {
          window.__navisInitialized = true;
          waitForChat(15);
        }, 1500);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Start initialization
  waitForChat();

  // Also watch for SPA navigation in all cases
  watchForNavigation();
})();

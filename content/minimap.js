/**
 * Navis Minimap - Core UI Component
 * Renders a visual minimap of the conversation and handles interactions.
 */

const NavisMinimap = (() => {
  let platform = null;
  let isVisible = false;
  let isManuallyHidden = false;
  let messages = [];
  let tooltip = null;
  let container = null;
  let body = null;
  let viewportIndicator = null;
  let countBadge = null;
  let toggleBtn = null;
  let scrollElement = null;
  let resizeObserver = null;
  let mutationObserver = null;
  let scrollTimeout = null;
  let updateThrottle = null;
  let lastMessageCount = 0;

  // Settings (defaults)
  let settings = {
    position: "right",
    opacity: 0.85,
    autoHide: true,
    autoHideDelay: 3000,
    minMessages: 3,
  };

  /**
   * Initialize the minimap for the detected platform.
   */
  function init(detectedPlatform) {
    platform = detectedPlatform;
    loadSettings(() => {
      createDOM();
      bindEvents();
      scheduleUpdate();
    });
  }

  /**
   * Load user settings from chrome.storage.
   */
  function loadSettings(callback) {
    if (chrome?.storage?.sync) {
      chrome.storage.sync.get(["navisSettings"], (result) => {
        if (result.navisSettings) {
          settings = { ...settings, ...result.navisSettings };
        }
        callback();
      });
    } else {
      callback();
    }
  }

  /**
   * Create all DOM elements for the minimap.
   */
  function createDOM() {
    // Main container
    container = document.createElement("div");
    container.id = "navis-minimap-container";

    // Panel
    const panel = document.createElement("div");
    panel.id = "navis-minimap-panel";

    // Header
    const header = document.createElement("div");
    header.id = "navis-minimap-header";

    const title = document.createElement("span");
    title.className = "navis-title";
    title.textContent = "Navis";

    countBadge = document.createElement("span");
    countBadge.className = "navis-count";
    countBadge.textContent = "0";

    header.appendChild(title);
    header.appendChild(countBadge);

    // Body (message bars)
    body = document.createElement("div");
    body.id = "navis-minimap-body";

    // Viewport indicator
    viewportIndicator = document.createElement("div");
    viewportIndicator.id = "navis-viewport-indicator";

    panel.appendChild(header);
    panel.appendChild(body);
    body.appendChild(viewportIndicator);

    container.appendChild(panel);

    // Tooltip
    tooltip = document.createElement("div");
    tooltip.id = "navis-tooltip";
    tooltip.innerHTML = `
      <div class="navis-tooltip-role"></div>
      <div class="navis-tooltip-text"></div>
    `;

    // Toggle button
    toggleBtn = document.createElement("button");
    toggleBtn.id = "navis-toggle-btn";
    toggleBtn.title = "Toggle Navis minimap";
    toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="7" height="18" rx="1.5"/>
      <line x1="14" y1="6" x2="21" y2="6"/>
      <line x1="14" y1="10" x2="21" y2="10"/>
      <line x1="14" y1="14" x2="19" y2="14"/>
      <line x1="14" y1="18" x2="17" y2="18"/>
    </svg>`;

    // Append to page
    document.body.appendChild(container);
    document.body.appendChild(tooltip);
    document.body.appendChild(toggleBtn);

    // Apply position setting
    if (settings.position === "left") {
      container.style.left = "8px";
      container.style.right = "auto";
      toggleBtn.style.left = "16px";
      toggleBtn.style.right = "auto";
    }
  }

  /**
   * Bind all event handlers.
   */
  function bindEvents() {
    // Toggle button
    toggleBtn.addEventListener("click", toggleMinimap);

    // Keyboard shortcut: Ctrl+Shift+M
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "M") {
        e.preventDefault();
        toggleMinimap();
      }
    });

    // Auto-show on hover near the edge
    document.addEventListener("mousemove", (e) => {
      if (isManuallyHidden) return;
      const threshold = settings.position === "left" ? 30 : window.innerWidth - 30;
      const isNearEdge =
        settings.position === "left"
          ? e.clientX < threshold
          : e.clientX > threshold;

      if (isNearEdge && messages.length >= settings.minMessages) {
        showMinimap();
      }
    });

    // Keep visible while hovering the minimap
    container.addEventListener("mouseenter", () => {
      container.classList.add("navis-hover");
      clearAutoHide();
    });

    container.addEventListener("mouseleave", () => {
      container.classList.remove("navis-hover");
      if (settings.autoHide && !isManuallyHidden) {
        scheduleAutoHide();
      }
    });

    // Watch for DOM changes (new messages)
    mutationObserver = new MutationObserver(() => {
      throttledUpdate();
    });

    // Start observing
    const observeTarget = document.querySelector("main") || document.body;
    mutationObserver.observe(observeTarget, {
      childList: true,
      subtree: true,
    });

    // Listen for scroll to update viewport indicator
    findAndBindScroll();

    // Re-check scroll element periodically (SPA navigation)
    setInterval(findAndBindScroll, 2000);

    // Window resize
    window.addEventListener("resize", () => {
      throttledUpdate();
    });

    // Listen for settings changes
    if (chrome?.storage?.onChanged) {
      chrome.storage.onChanged.addListener((changes) => {
        if (changes.navisSettings) {
          settings = { ...settings, ...changes.navisSettings.newValue };
          updatePosition();
        }
      });
    }
  }

  /**
   * Find the scroll element and bind scroll events.
   */
  function findAndBindScroll() {
    const newScrollEl = platform.getScrollElement();
    if (newScrollEl && newScrollEl !== scrollElement) {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", onScroll);
      }
      scrollElement = newScrollEl;
      scrollElement.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  /**
   * Handle scroll events.
   */
  function onScroll() {
    updateViewportIndicator();

    // Auto-show on scroll if there are enough messages
    if (
      !isManuallyHidden &&
      messages.length >= settings.minMessages
    ) {
      showMinimap();
      if (settings.autoHide) {
        scheduleAutoHide();
      }
    }
  }

  /**
   * Throttle updates to avoid performance issues.
   */
  function throttledUpdate() {
    if (updateThrottle) return;
    updateThrottle = setTimeout(() => {
      updateThrottle = null;
      update();
    }, 300);
  }

  /**
   * Schedule the first update with a delay to let the page load.
   */
  function scheduleUpdate() {
    setTimeout(update, 1000);
  }

  /**
   * Main update function: re-parse messages and re-render the minimap.
   */
  function update() {
    if (!platform) return;

    messages = platform.getMessages();
    renderBars();
    updateViewportIndicator();

    // Update count badge
    if (countBadge) {
      countBadge.textContent = messages.length;
    }

    // Auto-show if enough messages and not manually hidden
    if (messages.length >= settings.minMessages && !isManuallyHidden) {
      showMinimap();
      if (settings.autoHide) {
        scheduleAutoHide();
      }
    } else if (messages.length < settings.minMessages) {
      hideMinimap(false);
    }
  }

  /**
   * Render message bars in the minimap body.
   */
  function renderBars() {
    if (!body) return;

    // Clear existing bars (keep viewport indicator)
    const existing = body.querySelectorAll(".navis-msg-bar");
    existing.forEach((el) => el.remove());

    messages.forEach((msg, index) => {
      const bar = document.createElement("div");
      bar.className = `navis-msg-bar ${msg.isUser ? "navis-user" : "navis-ai"}`;

      // Height proportional to message length (clamped)
      const textLen = msg.text.length;
      const height = Math.max(6, Math.min(28, Math.round(textLen / 40) + 4));
      bar.style.height = `${height}px`;

      // Hover: show tooltip
      bar.addEventListener("mouseenter", (e) => showTooltip(e, msg));
      bar.addEventListener("mousemove", (e) => moveTooltip(e));
      bar.addEventListener("mouseleave", hideTooltip);

      // Click: scroll to message
      bar.addEventListener("click", () => scrollToMessage(msg, index));

      bar.dataset.index = index;
      body.appendChild(bar);
    });
  }

  /**
   * Update the viewport indicator position and size.
   */
  function updateViewportIndicator() {
    if (!viewportIndicator || !scrollElement || !body || messages.length === 0) {
      if (viewportIndicator) viewportIndicator.style.display = "none";
      return;
    }

    viewportIndicator.style.display = "block";

    const scrollTop = scrollElement.scrollTop;
    const scrollHeight = scrollElement.scrollHeight;
    const clientHeight = scrollElement.clientHeight;
    const bodyHeight = body.scrollHeight;

    if (scrollHeight <= clientHeight) {
      viewportIndicator.style.display = "none";
      return;
    }

    const ratio = clientHeight / scrollHeight;
    const topRatio = scrollTop / scrollHeight;

    const indicatorHeight = Math.max(20, ratio * bodyHeight);
    const indicatorTop = topRatio * bodyHeight;

    viewportIndicator.style.top = `${indicatorTop}px`;
    viewportIndicator.style.height = `${indicatorHeight}px`;
  }

  /**
   * Show tooltip with message preview.
   */
  function showTooltip(e, msg) {
    if (!tooltip) return;

    const roleEl = tooltip.querySelector(".navis-tooltip-role");
    const textEl = tooltip.querySelector(".navis-tooltip-text");

    roleEl.textContent = msg.isUser ? "You" : "AI";
    roleEl.className = `navis-tooltip-role ${msg.isUser ? "navis-role-user" : "navis-role-ai"}`;

    // Truncate long messages
    const maxLen = 200;
    const displayText =
      msg.text.length > maxLen
        ? msg.text.substring(0, maxLen) + "..."
        : msg.text;
    textEl.textContent = displayText;

    tooltip.classList.add("navis-tooltip-visible");
    moveTooltip(e);
  }

  /**
   * Move tooltip to follow mouse.
   */
  function moveTooltip(e) {
    if (!tooltip) return;

    const tooltipWidth = tooltip.offsetWidth;
    const padding = 12;

    let left, top;

    if (settings.position === "left") {
      left = e.clientX + padding;
    } else {
      left = e.clientX - tooltipWidth - padding;
    }

    top = e.clientY - 20;

    // Keep tooltip on screen
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }
    if (top < 10) top = 10;

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  /**
   * Hide the tooltip.
   */
  function hideTooltip() {
    if (tooltip) {
      tooltip.classList.remove("navis-tooltip-visible");
    }
  }

  /**
   * Scroll to a specific message in the chat.
   */
  function scrollToMessage(msg, index) {
    if (!msg.element) return;

    msg.element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // Brief highlight effect
    const bars = body.querySelectorAll(".navis-msg-bar");
    bars.forEach((b) => b.classList.remove("navis-active"));
    if (bars[index]) {
      bars[index].classList.add("navis-active");
      setTimeout(() => {
        bars[index]?.classList.remove("navis-active");
      }, 2000);
    }
  }

  /**
   * Show the minimap.
   */
  function showMinimap() {
    if (!container) return;
    isVisible = true;
    container.classList.add("navis-visible");
  }

  /**
   * Hide the minimap.
   */
  function hideMinimap(manual = true) {
    if (!container) return;
    isVisible = false;
    if (manual) isManuallyHidden = true;
    container.classList.remove("navis-visible");
    hideTooltip();
  }

  /**
   * Toggle minimap visibility.
   */
  function toggleMinimap() {
    if (isVisible) {
      hideMinimap(true);
    } else {
      isManuallyHidden = false;
      showMinimap();
      if (settings.autoHide) {
        scheduleAutoHide();
      }
      update(); // Refresh content
    }
  }

  /**
   * Schedule auto-hide after delay.
   */
  function scheduleAutoHide() {
    clearAutoHide();
    scrollTimeout = setTimeout(() => {
      if (!container?.classList.contains("navis-hover")) {
        hideMinimap(false);
      }
    }, settings.autoHideDelay);
  }

  /**
   * Clear the auto-hide timer.
   */
  function clearAutoHide() {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
      scrollTimeout = null;
    }
  }

  /**
   * Update position based on settings.
   */
  function updatePosition() {
    if (!container || !toggleBtn) return;
    if (settings.position === "left") {
      container.style.left = "8px";
      container.style.right = "auto";
      toggleBtn.style.left = "16px";
      toggleBtn.style.right = "auto";
    } else {
      container.style.right = "8px";
      container.style.left = "auto";
      toggleBtn.style.right = "16px";
      toggleBtn.style.left = "auto";
    }
  }

  /**
   * Destroy the minimap (cleanup).
   */
  function destroy() {
    if (mutationObserver) mutationObserver.disconnect();
    if (resizeObserver) resizeObserver.disconnect();
    if (scrollElement) {
      scrollElement.removeEventListener("scroll", onScroll);
    }
    container?.remove();
    tooltip?.remove();
    toggleBtn?.remove();
    clearAutoHide();
  }

  return {
    init,
    update,
    show: showMinimap,
    hide: hideMinimap,
    toggle: toggleMinimap,
    destroy,
  };
})();

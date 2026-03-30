/**
 * Platform-specific message parsers for ChatGPT, Gemini, and Claude.
 * Each parser knows how to find the chat container, extract messages,
 * and identify user vs AI messages from the DOM.
 */

const NavisPlatforms = (() => {
  /**
   * Detect which AI platform we're on based on the URL.
   */
  function detectPlatform() {
    const host = window.location.hostname;
    if (host.includes("chat.openai.com") || host.includes("chatgpt.com")) {
      return "chatgpt";
    }
    if (host.includes("gemini.google.com")) {
      return "gemini";
    }
    if (host.includes("claude.ai")) {
      return "claude";
    }
    return null;
  }

  /**
   * Platform configurations with DOM selectors and parsing logic.
   */
  const platforms = {
    chatgpt: {
      name: "ChatGPT",
      /**
       * Get the scrollable chat container.
       */
      getChatContainer() {
        return (
          document.querySelector('main div[class*="react-scroll-to-bottom"]') ||
          document.querySelector("main .overflow-y-auto") ||
          document.querySelector('main [role="presentation"]') ||
          document.querySelector("main")
        );
      },
      /**
       * Get the actual scrollable element inside the container.
       */
      getScrollElement() {
        const container = this.getChatContainer();
        if (!container) return null;
        // ChatGPT nests the scrollable div
        return (
          container.querySelector(".overflow-y-auto") ||
          container.querySelector('[class*="overflow"]') ||
          container
        );
      },
      /**
       * Extract all messages from the chat.
       */
      getMessages() {
        const messages = [];
        // ChatGPT uses article elements or data-message-author-role
        const messageEls =
          document.querySelectorAll('[data-message-author-role]');

        if (messageEls.length > 0) {
          messageEls.forEach((el) => {
            const role = el.getAttribute("data-message-author-role");
            const isUser = role === "user";
            const textEl = el.querySelector(".markdown, .whitespace-pre-wrap") || el;
            const text = textEl?.textContent?.trim() || "";
            if (text) {
              messages.push({
                element: el,
                text,
                isUser,
                role: isUser ? "user" : "assistant",
              });
            }
          });
        } else {
          // Fallback: look for conversation turn divs
          const turns = document.querySelectorAll(
            '[data-testid^="conversation-turn"]'
          );
          turns.forEach((turn, i) => {
            const isUser = i % 2 === 0;
            const textEl =
              turn.querySelector(".markdown, .whitespace-pre-wrap") || turn;
            const text = textEl?.textContent?.trim() || "";
            if (text) {
              messages.push({
                element: turn,
                text,
                isUser,
                role: isUser ? "user" : "assistant",
              });
            }
          });
        }
        return messages;
      },
    },

    gemini: {
      name: "Gemini",
      getChatContainer() {
        return (
          document.querySelector("chat-app") ||
          document.querySelector(".conversation-container") ||
          document.querySelector("main") ||
          document.body
        );
      },
      getScrollElement() {
        // Gemini's main scrollable area
        return (
          document.querySelector("infinite-scroller") ||
          document.querySelector(".conversation-container") ||
          document.querySelector("main") ||
          document.documentElement
        );
      },
      getMessages() {
        const messages = [];

        // Primary: Gemini uses <user-query> and <model-response> custom elements
        const userQueries = document.querySelectorAll("user-query");
        const modelResponses = document.querySelectorAll("model-response");

        if (userQueries.length > 0 || modelResponses.length > 0) {
          const allMsgs = [];

          userQueries.forEach((el) => {
            // Extract the query content, stripping "You said" prefix
            const queryContent =
              el.querySelector(".query-content") ||
              el.querySelector(".user-query-container") ||
              el;
            let text = queryContent?.textContent?.trim() || "";
            text = text.replace(/^You said\s*/i, "").trim();
            if (text) {
              allMsgs.push({
                element: el,
                text,
                isUser: true,
                role: "user",
                top: el.getBoundingClientRect().top,
              });
            }
          });

          modelResponses.forEach((el) => {
            // Get the response text, excluding thinking/avatar/header elements
            const responseContainer =
              el.querySelector(".response-container") || el;
            const markdownPanel =
              responseContainer.querySelector(".markdown-main-panel") ||
              responseContainer.querySelector(".model-response-text") ||
              responseContainer.querySelector(".response-content") ||
              responseContainer;

            // Clone to safely strip unwanted elements
            const clone = markdownPanel.cloneNode(true);
            clone.querySelectorAll(
              '[class*="thinking"], [class*="Thinking"]'
            ).forEach((t) => t.remove());
            clone.querySelectorAll(
              '[class*="avatar"], bard-avatar, .bard-avatar, BARD-AVATAR'
            ).forEach((a) => a.remove());
            clone.querySelectorAll(
              '[class*="header-controls"], [class*="response-container-header"]'
            ).forEach((h) => h.remove());
            const text = clone.textContent?.trim() || "";

            if (text) {
              allMsgs.push({
                element: el,
                text,
                isUser: false,
                role: "assistant",
                top: el.getBoundingClientRect().top,
              });
            }
          });

          // Sort by vertical position
          allMsgs.sort((a, b) => a.top - b.top);
          allMsgs.forEach(({ element, text, isUser, role }) => {
            messages.push({ element, text, isUser, role });
          });
        }

        // Fallback: data-turn-role attributes
        if (messages.length === 0) {
          const allTurns = document.querySelectorAll(
            '[data-turn-role], .turn'
          );
          allTurns.forEach((turn) => {
            const role = turn.getAttribute("data-turn-role");
            const isUser = role === "user" || role === "human";
            const text = turn.textContent?.trim() || "";
            if (text) {
              messages.push({
                element: turn,
                text,
                isUser,
                role: isUser ? "user" : "assistant",
              });
            }
          });
        }

        return messages;
      },
    },

    claude: {
      name: "Claude",
      getChatContainer() {
        return (
          document.querySelector('[class*="ThreadLayout"]') ||
          document.querySelector('[class*="thread-layout"]') ||
          document.querySelector('[class*="conversation-content"]') ||
          document.querySelector('[role="main"]') ||
          document.querySelector("main")
        );
      },
      getScrollElement() {
        // Claude's scrollable container
        const mainEl =
          document.querySelector('[role="main"]') ||
          document.querySelector("main");
        if (mainEl) {
          // Find the scrollable child inside main
          const scroller =
            mainEl.querySelector('[class*="overflow-y"]') ||
            mainEl.querySelector('[class*="overflow-auto"]') ||
            mainEl.querySelector('[style*="overflow"]');
          if (scroller) return scroller;
        }
        return (
          document.querySelector(".overflow-y-auto") ||
          mainEl ||
          document.documentElement
        );
      },
      getMessages() {
        const messages = [];

        // Strategy 1: Claude uses font-user-message / font-claude-message classes
        const userMsgsByFont = document.querySelectorAll(
          '[class*="font-user-message"]'
        );
        const aiMsgsByFont = document.querySelectorAll(
          '[class*="font-claude-message"]'
        );

        if (userMsgsByFont.length > 0 || aiMsgsByFont.length > 0) {
          const allMsgs = [];
          userMsgsByFont.forEach((el) => {
            const turnEl =
              el.closest('[data-testid]') ||
              el.closest('[class*="turn"]') ||
              el.parentElement?.parentElement ||
              el;
            const text = el.textContent?.trim() || "";
            if (text) {
              allMsgs.push({
                element: turnEl,
                text,
                isUser: true,
                role: "user",
                top: el.getBoundingClientRect().top,
              });
            }
          });
          aiMsgsByFont.forEach((el) => {
            const turnEl =
              el.closest('[data-testid]') ||
              el.closest('[class*="turn"]') ||
              el.parentElement?.parentElement ||
              el;
            // Clone to exclude thinking blocks
            const clone = el.cloneNode(true);
            clone.querySelectorAll(
              '[class*="thinking"], [class*="Thinking"], details, summary'
            ).forEach((t) => t.remove());
            const text = clone.textContent?.trim() || "";
            if (text) {
              allMsgs.push({
                element: turnEl,
                text,
                isUser: false,
                role: "assistant",
                top: el.getBoundingClientRect().top,
              });
            }
          });
          allMsgs.sort((a, b) => a.top - b.top);
          allMsgs.forEach(({ element, text, isUser, role }) => {
            messages.push({ element, text, isUser, role });
          });
        }

        // Strategy 2: data-testid based selectors
        if (messages.length === 0) {
          const humanMsgs = document.querySelectorAll(
            '[data-testid="human-turn"], [data-testid*="human"], [class*="human-turn"], [class*="user-turn"]'
          );
          const aiMsgs = document.querySelectorAll(
            '[data-testid="ai-turn"], [data-testid*="assistant"], [class*="ai-turn"], [class*="assistant-turn"]'
          );

          if (humanMsgs.length > 0 || aiMsgs.length > 0) {
            const allMsgs = [];
            humanMsgs.forEach((el) => {
              const text = el.textContent?.trim() || "";
              if (text) {
                allMsgs.push({
                  element: el,
                  text,
                  isUser: true,
                  role: "user",
                  top: el.getBoundingClientRect().top,
                });
              }
            });
            aiMsgs.forEach((el) => {
              const clone = el.cloneNode(true);
              clone.querySelectorAll(
                '[class*="thinking"], [class*="Thinking"], details, summary'
              ).forEach((t) => t.remove());
              const text = clone.textContent?.trim() || "";
              if (text) {
                allMsgs.push({
                  element: el,
                  text,
                  isUser: false,
                  role: "assistant",
                  top: el.getBoundingClientRect().top,
                });
              }
            });
            allMsgs.sort((a, b) => a.top - b.top);
            allMsgs.forEach(({ element, text, isUser, role }) => {
              messages.push({ element, text, isUser, role });
            });
          }
        }

        // Strategy 3: Broad attribute/class scan for message grouping
        if (messages.length === 0) {
          const candidates = document.querySelectorAll(
            '[class*="message"], [class*="Message"], [class*="turn"], [class*="Turn"], [data-role]'
          );
          const seen = new Set();
          candidates.forEach((el) => {
            const text = el.textContent?.trim() || "";
            if (text && text.length > 3 && !seen.has(text.substring(0, 50))) {
              seen.add(text.substring(0, 50));
              const cls = (el.className || "").toLowerCase();
              const role = el.getAttribute("data-role") || "";
              const isUser =
                cls.includes("user") ||
                cls.includes("human") ||
                role === "user" ||
                role === "human";
              const isAI =
                cls.includes("assistant") ||
                cls.includes("claude") ||
                cls.includes("ai") ||
                role === "assistant";
              if (isUser || isAI) {
                messages.push({
                  element: el,
                  text,
                  isUser,
                  role: isUser ? "user" : "assistant",
                });
              }
            }
          });
        }

        return messages;
      },
    },
  };

  return {
    detectPlatform,
    getPlatform(name) {
      return platforms[name] || null;
    },
    platforms,
  };
})();

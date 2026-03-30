/**
 * Navis Popup - Settings management
 */

document.addEventListener("DOMContentLoaded", () => {
  const positionSelect = document.getElementById("position");
  const autoHideCheckbox = document.getElementById("autoHide");
  const minMessagesSelect = document.getElementById("minMessages");

  // Load current settings
  chrome.storage.sync.get(["navisSettings"], (result) => {
    const settings = result.navisSettings || {};

    if (settings.position) {
      positionSelect.value = settings.position;
    }
    if (typeof settings.autoHide === "boolean") {
      autoHideCheckbox.checked = settings.autoHide;
    }
    if (settings.minMessages) {
      minMessagesSelect.value = String(settings.minMessages);
    }
  });

  // Save on change
  function saveSettings() {
    const settings = {
      position: positionSelect.value,
      autoHide: autoHideCheckbox.checked,
      minMessages: parseInt(minMessagesSelect.value, 10),
    };

    chrome.storage.sync.set({ navisSettings: settings });
  }

  positionSelect.addEventListener("change", saveSettings);
  autoHideCheckbox.addEventListener("change", saveSettings);
  minMessagesSelect.addEventListener("change", saveSettings);
});

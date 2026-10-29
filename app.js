// Loads the pinned Vapi widget and starts it with the settings from config.js.
// The SDK URL is pinned to an exact version and verified with Subresource Integrity.
// To upgrade: change VAPI_SDK_VERSION, recompute the hash (see frontend/README.md), re-test by voice.
(function () {
  "use strict";

  var VAPI_SDK_VERSION = "1.1.10";
  var VAPI_SDK_SRI = "sha384-jpj68nAINCqCXiRJPAOqdnQm8HUxzwbUU7SZNNYeaKLW2k+vR+Cg8CRm+Ra71Nxg";
  var VAPI_SDK_URL =
    "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@" + VAPI_SDK_VERSION + "/dist/assets/index.js";

  var statusEl = document.getElementById("status");

  function setStatus(text, isError) {
    statusEl.textContent = text;
    statusEl.className = isError ? "error" : "";
  }

  function isConfigured(cfg) {
    return (
      cfg &&
      typeof cfg.vapiPublicKey === "string" &&
      typeof cfg.assistantId === "string" &&
      cfg.vapiPublicKey !== "" &&
      cfg.assistantId !== "" &&
      cfg.vapiPublicKey.indexOf("YOUR_") !== 0 &&
      cfg.assistantId.indexOf("YOUR_") !== 0
    );
  }

  var cfg = window.APP_CONFIG;
  if (!isConfigured(cfg)) {
    setStatus("הדף לא הוגדר. פנה למרצה (חסר קובץ config.js עם מפתח ו-assistant).", true);
    return;
  }

  var script = document.createElement("script");
  script.src = VAPI_SDK_URL;
  script.integrity = VAPI_SDK_SRI;
  script.crossOrigin = "anonymous";
  script.async = true;

  script.onload = function () {
    try {
      window.vapiSDK.run({
        apiKey: cfg.vapiPublicKey,
        assistant: cfg.assistantId,
        config: { position: "bottom-right" },
      });
      setStatus("מוכן. לחץ על כפתור השיחה בפינת המסך.", false);
    } catch (err) {
      setStatus("לא ניתן להפעיל את מערכת השיחה. רענן את הדף ונסה שוב.", true);
    }
  };

  script.onerror = function () {
    setStatus("טעינת מערכת השיחה נכשלה. בדוק את החיבור לאינטרנט ורענן את הדף.", true);
  };

  document.head.appendChild(script);
})();

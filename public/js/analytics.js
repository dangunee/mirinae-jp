/**
 * mirinae.jp アクセス解析スクリプト
 * セッション開始・終了を記録し、admin.mirinae.jp の API に送信
 */
(function () {
  var API_BASE = "https://admin.mirinae.jp";
  var STORAGE_KEY = "mirinae_analytics_session";

  function getSessionId() {
    try {
      var id = sessionStorage.getItem(STORAGE_KEY);
      if (!id) {
        id = (typeof crypto !== "undefined" && crypto.randomUUID)
          ? crypto.randomUUID()
          : "s-" + Date.now() + "-" + Math.random().toString(36).slice(2);
        sessionStorage.setItem(STORAGE_KEY, id);
      }
      return id;
    } catch (e) {
      return "s-" + Date.now();
    }
  }

  function sendEvent(event, payload) {
    var body = JSON.stringify(
      Object.assign({ event: event }, payload)
    );
    var url = API_BASE + "/api/analytics";
    if (navigator.sendBeacon && event === "session_end") {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    } else {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
        keepalive: event === "session_end",
      }).catch(function () {});
    }
  }

  var sessionId = getSessionId();
  var startTime = Date.now();
  var pagePath =
    (typeof location !== "undefined" && location.pathname) || "/";

  // session_start
  sendEvent("session_start", {
    session_id: sessionId,
    referrer:
      typeof document !== "undefined" ? document.referrer || undefined : undefined,
    page_path: pagePath,
  });

  // session_end on visibility change or pagehide
  function onEnd() {
    var duration = Math.round((Date.now() - startTime) / 1000);
    sendEvent("session_end", {
      session_id: sessionId,
      duration_seconds: duration,
    });
    sessionStorage.removeItem(STORAGE_KEY);
  }

  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") onEnd();
    });
  }
  if (typeof window !== "undefined") {
    window.addEventListener("pagehide", onEnd);
  }
})();

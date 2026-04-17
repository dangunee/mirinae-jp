/**
 * Loads Cloudflare Turnstile for forms with data-turnstile-form.
 * Site key from /api/public/turnstile-site-key (env NEXT_PUBLIC_TURNSTILE_SITE_KEY or TURNSTILE_SITE_KEY).
 */
(function () {
  function ensureHidden(form, name) {
    var el = form.querySelector('input[name="' + name + '"]');
    if (el) return el;
    el = document.createElement("input");
    el.type = "hidden";
    el.name = name;
    form.appendChild(el);
    return el;
  }

  function bindSubmit(form, widgetId) {
    form.addEventListener(
      "submit",
      function () {
        if (!window.turnstile || widgetId == null) return;
        var token = window.turnstile.getResponse(widgetId) || "";
        ensureHidden(form, "cf-turnstile-response").value = token;
        var legacy = form.querySelector('input[name="turnstileToken"]');
        if (legacy) legacy.value = token;
      },
      true
    );
  }

  function init() {
    fetch("/api/public/turnstile-site-key")
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        var siteKey = d && d.siteKey;
        if (!siteKey) return;

        var script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        script.onload = function () {
          if (!window.turnstile) return;
          document.querySelectorAll("form[data-turnstile-form]").forEach(
            function (form) {
              var slot = form.querySelector(".turnstile-slot");
              if (!slot) return;

              var widgetId = window.turnstile.render(slot, {
                sitekey: siteKey,
                callback: function (token) {
                  ensureHidden(form, "cf-turnstile-response").value = token || "";
                  var legacy = form.querySelector('input[name="turnstileToken"]');
                  if (legacy) legacy.value = token || "";
                },
                "expired-callback": function () {
                  ensureHidden(form, "cf-turnstile-response").value = "";
                  var legacy = form.querySelector('input[name="turnstileToken"]');
                  if (legacy) legacy.value = "";
                },
                "error-callback": function () {
                  ensureHidden(form, "cf-turnstile-response").value = "";
                  var legacy = form.querySelector('input[name="turnstileToken"]');
                  if (legacy) legacy.value = "";
                },
              });

              bindSubmit(form, widgetId);
            }
          );
        };
        document.head.appendChild(script);
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

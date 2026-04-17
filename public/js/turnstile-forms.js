/**
 * Loads Cloudflare Turnstile for forms with data-turnstile-form.
 * Site key from /api/public/turnstile-site-key (env NEXT_PUBLIC_TURNSTILE_SITE_KEY or TURNSTILE_SITE_KEY).
 */
(function () {
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
              var input = form.querySelector('input[name="turnstileToken"]');
              if (!slot || !input) return;
              window.turnstile.render(slot, {
                sitekey: siteKey,
                callback: function (token) {
                  input.value = token || "";
                },
                "expired-callback": function () {
                  input.value = "";
                },
                "error-callback": function () {
                  input.value = "";
                },
              });
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

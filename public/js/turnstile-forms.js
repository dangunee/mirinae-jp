/**
 * Cloudflare Turnstile + /api/public-form/ は fetch 送信（JSON 応答）で
 * 送信中のフィードバックとエラー表示を行う。
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

  var CODE_FALLBACK = {
    rate: "送信が集中しています。しばらく時間をおいてから再度お試しください。",
    validation: "入力内容をご確認ください。",
    invalid_phone:
      "電話番号をご確認ください。数字10〜15桁で入力してください（ハイフンやスペースは除いて数えます。全角数字も入力できます）。",
    turnstile:
      "認証の確認に失敗しました。ページを再読み込みのうえ、再度お試しください。",
    parse: "通信エラーが発生しました。再度お試しください。",
    forbidden: "送信を受け付けできませんでした。",
    mail: "",
  };

  function showFormFetchError(code, message) {
    var banner =
      document.getElementById("form-error-banner") ||
      document.getElementById("syutyu-form-error-banner") ||
      document.getElementById("kaiwa-t01-form-error");
    var sub =
      document.getElementById("form-error-sub") ||
      document.getElementById("syutyu-form-error-sub") ||
      document.getElementById("kaiwa-t01-form-error-msg");
    var text =
      message ||
      (code && CODE_FALLBACK[code]) ||
      CODE_FALLBACK.validation;
    if (banner) {
      banner.style.display = "block";
      var titleP = banner.querySelector("p:first-child");
      if (titleP) titleP.textContent = "送信に失敗しました。";
      if (sub) {
        if (code === "mail") {
          sub.innerHTML =
            "メールの送信に失敗しました。しばらくしてから再度お試しいただくか、<a href=\"mailto:mirinae@kaonnuri.com\">mirinae@kaonnuri.com</a> までご連絡ください。";
        } else {
          sub.textContent = text;
        }
      }
      banner.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.alert(text);
    }
  }

  function getSubmitControl(form) {
    return form.querySelector(
      'button[type="submit"], input[type="submit"]'
    );
  }

  function setSubmitBusy(btn, busy) {
    if (!btn) return;
    if (busy) {
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
      if (btn.tagName === "BUTTON") {
        btn.dataset.mirinaePrevText = btn.textContent;
        btn.textContent = "送信中…";
      } else if (btn.tagName === "INPUT" && btn.type === "submit") {
        btn.dataset.mirinaePrevValue = btn.value;
        btn.value = "送信中…";
      }
    } else {
      btn.disabled = false;
      btn.removeAttribute("aria-busy");
      if (btn.tagName === "BUTTON" && btn.dataset.mirinaePrevText != null) {
        btn.textContent = btn.dataset.mirinaePrevText;
        delete btn.dataset.mirinaePrevText;
      } else if (
        btn.tagName === "INPUT" &&
        btn.type === "submit" &&
        btn.dataset.mirinaePrevValue != null
      ) {
        btn.value = btn.dataset.mirinaePrevValue;
        delete btn.dataset.mirinaePrevValue;
      }
    }
  }

  function courseFormNeedsTurnstile(subject) {
    if (!subject) return false;
    var s = subject.trim();
    return (
      s.indexOf("【体験申込】") === 0 || s.indexOf("【講座申込】") === 0
    );
  }

  function bindAjaxSubmit(form) {
    var action = form.getAttribute("action") || "";
    if (action.indexOf("/api/public-form") === -1) return;

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      var btn = getSubmitControl(form);
      setSubmitBusy(btn, true);

      var widgetId = form._mirinaeTurnstileWidgetId;
      if (window.turnstile && widgetId != null) {
        var token = window.turnstile.getResponse(widgetId) || "";
        ensureHidden(form, "cf-turnstile-response").value = token;
        var legacy = form.querySelector('input[name="turnstileToken"]');
        if (legacy) legacy.value = token;
      }

      var subjectEl = form.querySelector('input[name="_subject"]');
      var subject = subjectEl ? subjectEl.value : "";
      if (
        courseFormNeedsTurnstile(subject) &&
        form.getAttribute("data-turnstile-form") !== null
      ) {
        if (!window.turnstile || widgetId == null) {
          showFormFetchError("turnstile", null);
          setSubmitBusy(btn, false);
          return;
        }
        var tok = window.turnstile.getResponse(widgetId) || "";
        if (!tok) {
          showFormFetchError("turnstile", null);
          setSubmitBusy(btn, false);
          return;
        }
      }

      var fd = new FormData(form);
      fetch(action, {
        method: "POST",
        body: fd,
        headers: {
          Accept: "application/json",
          "X-Mirinae-Form-Fetch": "1",
        },
        credentials: "same-origin",
      })
        .then(function (r) {
          return r.text().then(function (text) {
            var j = null;
            try {
              j = text ? JSON.parse(text) : null;
            } catch (e) {
              j = null;
            }
            return { ok: r.ok, status: r.status, j: j };
          });
        })
        .then(function (out) {
          if (out.ok && out.j && out.j.success) {
            var next = form.querySelector('input[name="_next"]');
            window.location.href =
              next && next.value ? next.value : "/";
            return;
          }
          var code = out.j && out.j.code;
          var msg = out.j && out.j.message;
          if (out.status === 429) code = "rate";
          else if (out.status === 403) code = "forbidden";
          else if (out.status >= 500) code = "mail";
          else if (!out.j) code = "parse";
          else if (!code) code = "validation";
          showFormFetchError(code, msg);
          setSubmitBusy(btn, false);
        })
        .catch(function () {
          showFormFetchError("parse", null);
          setSubmitBusy(btn, false);
        });
    });
  }

  var cachedTurnstileSiteKey = null;

  function renderTurnstileOnForm(form, siteKey) {
    var slot = form.querySelector(".turnstile-slot");
    if (!slot || form._mirinaeTurnstileWidgetId != null) return;
    if (!window.turnstile || !siteKey) return;

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

    form._mirinaeTurnstileWidgetId = widgetId;
  }

  /** 非表示タブ内など、後から表示されるフォーム用（会話強化 kaiwa 講座タブなど） */
  window.mirinaeMountDeferredTurnstile = function (form) {
    if (!form || form.getAttribute("data-turnstile-defer") !== "1") return;
    renderTurnstileOnForm(form, cachedTurnstileSiteKey);
  };

  function initTurnstileWidgets() {
    fetch("/api/public/turnstile-site-key")
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        var siteKey = d && d.siteKey;
        cachedTurnstileSiteKey = siteKey || null;
        if (!siteKey) return;

        var script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        script.onload = function () {
          if (!window.turnstile) return;
          document
            .querySelectorAll("form[data-turnstile-form]")
            .forEach(function (form) {
              if (form.getAttribute("data-turnstile-defer") === "1") return;
              renderTurnstileOnForm(form, siteKey);
            });
        };
        document.head.appendChild(script);
      })
      .catch(function () {});
  }

  function boot() {
    document
      .querySelectorAll('form[action="/api/public-form/"]')
      .forEach(function (form) {
        if (form._mirinaeAjaxBound) return;
        form._mirinaeAjaxBound = true;
        bindAjaxSubmit(form);
      });
    initTurnstileWidgets();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

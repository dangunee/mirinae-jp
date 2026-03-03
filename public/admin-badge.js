(function () {
  fetch("/api/admin/check", { credentials: "same-origin" })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function () {
      var a = document.createElement("a");
      a.href = "/admin";
      a.textContent = "管理モードで接続中";
      a.style.cssText = [
        "position:fixed",
        "top:56px",
        "right:20px",
        "z-index:9999",
        "padding:10px 16px",
        "background:#3d6b6b",
        "color:#fff",
        "text-decoration:none",
        "border-radius:8px",
        "font-size:14px",
        "font-family:'Noto Sans JP',sans-serif",
        "box-shadow:0 2px 8px rgba(0,0,0,0.2)"
      ].join(";");
      document.body.appendChild(a);
    })
    .catch(function () {});
})();

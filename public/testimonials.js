(function () {
  var containers = document.querySelectorAll(".testimonials-container");
  if (!containers.length) return;
  var byPage = {};
  containers.forEach(function (el) {
    var page = el.getAttribute("data-page");
    var block = el.getAttribute("data-block");
    var format = el.getAttribute("data-format") || "default";
    if (!page || !block) return;
    if (!byPage[page]) byPage[page] = [];
    byPage[page].push({ el: el, block: block, format: format });
  });
  Object.keys(byPage).forEach(function (page) {
    fetch("/api/testimonials?page=" + encodeURIComponent(page))
      .then(function (r) { return r.json(); })
      .then(function (blocks) {
        if (!Array.isArray(blocks)) return;
        byPage[page].forEach(function (item) {
          var block = blocks.find(function (b) { return b.blockKey === item.block; });
          if (!block || !block.rows || !block.rows.length) return;
          var html = "";
          block.rows.forEach(function (row) {
            if (item.format === "beg") {
              var header = (row.header || "").split(/[｜|]/);
              var name = (header[0] || "").trim();
              var date = (header[1] || "").trim();
              var avatar = name ? name.charAt(0) : "?";
              html += '<div class="beg-testimonial">';
              html += '<div class="beg-testimonial-meta">';
              html += '<div class="beg-testimonial-avatar">' + escapeHtml(avatar) + "</div>";
              html += '<div><span class="beg-testimonial-name">' + escapeHtml(name) + "</span>";
              if (date) html += ' <span class="beg-testimonial-date">' + escapeHtml(date) + "</span>";
              html += "</div></div>";
              html += '<div class="beg-testimonial-body">' + (row.content || "") + "</div>";
              html += "</div>";
            } else {
              var header = (row.header || "").split(/[｜|]/);
              var nameOnly = (header[0] || "").trim();
              html += '<div class="testimonial">';
              html += '<div class="testimonial-header">' + escapeHtml(nameOnly) + "</div>";
              html += '<div class="testimonial-content">' + (row.content || "") + "</div>";
              html += "</div>";
            }
          });
          item.el.innerHTML = html;
        });
      })
      .catch(function () {});
  });
  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }
})();

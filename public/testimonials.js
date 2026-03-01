(function () {
  var containers = document.querySelectorAll(".testimonials-container");
  if (!containers.length) return;
  var byPage = {};
  containers.forEach(function (el) {
    var page = el.getAttribute("data-page");
    var block = el.getAttribute("data-block");
    if (!page || !block) return;
    if (!byPage[page]) byPage[page] = [];
    byPage[page].push({ el: el, block: block });
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
            html += '<div class="testimonial">';
            html += '<div class="testimonial-header">' + escapeHtml(row.header || "") + "</div>";
            html += '<div class="testimonial-content">' + (row.content || "") + "</div>";
            html += "</div>";
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

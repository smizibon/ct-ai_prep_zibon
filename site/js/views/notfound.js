/* views/notfound.js — #/404 */
(function () {
  "use strict";
  window.CTAI_VIEWS = window.CTAI_VIEWS || {};
  window.CTAI_VIEWS.notfound = {
    render: function () {
      return UI.el("div", { class: "page" },
        UI.emptyState("Page not found", "The route you followed doesn't exist.",
          UI.el("a", { class: "btn btn--primary btn--sm", href: "#/", "data-testid": "notfound-home" }, "Go to dashboard")));
    }
  };
})();

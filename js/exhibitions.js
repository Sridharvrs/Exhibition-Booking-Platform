/* Exhibitions Page — Filter & Newsletter Scripts */

document.addEventListener("DOMContentLoaded", function () {
  /* ===== Category filter ===== */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var exhibCards = document.querySelectorAll(".exhib-card");
  var noResults = document.getElementById("noResults");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      var filter = btn.getAttribute("data-filter");
      var visibleCount = 0;

      exhibCards.forEach(function (card) {
        var cat = card.getAttribute("data-category");
        if (filter === "all" || cat === filter) {
          card.classList.remove("hidden");
          card.style.animation = "none";
          void card.offsetWidth;
          card.style.animation = "fadeInUp 0.5s ease forwards";
          visibleCount++;
        } else {
          card.classList.add("hidden");
        }
      });

      if (noResults) {
        noResults.style.display = visibleCount === 0 ? "block" : "none";
      }
    });
  });

  /* Add fadeInUp keyframe dynamically */
  var style = document.createElement("style");
  style.textContent =
    "@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }";
  document.head.appendChild(style);

  /* ===== Newsletter form ===== */
  var form = document.getElementById("newsletterForm");
  var msg = document.getElementById("newsletterMsg");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      msg.textContent = "Thank you for subscribing! Watch your inbox for exhibition updates.";
      form.reset();
      setTimeout(function () { msg.textContent = ""; }, 4000);
    });
  }
});

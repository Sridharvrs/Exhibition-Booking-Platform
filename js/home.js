/* Home Page — Interactive Scripts */

document.addEventListener("DOMContentLoaded", function () {
  /* Parallax effect on hero shapes */
  var shapes = document.querySelectorAll(".floating-shapes .shape");
  if (shapes.length) {
    document.addEventListener("mousemove", function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 30;
      var y = (e.clientY / window.innerHeight - 0.5) * 30;
      shapes.forEach(function (shape, i) {
        var factor = (i + 1) * 0.5;
        shape.style.transform = "translate(" + x * factor + "px, " + y * factor + "px)";
      });
    });
  }

  /* Category card click → navigate to exhibitions */
  document.querySelectorAll(".category-card").forEach(function (card) {
    card.addEventListener("click", function () {
      window.location.href = "exhibitions.html";
    });
  });
});

/* Booking Page — Multi-step Wizard Logic */

var exhibNames = {
  "art-fair": "Contemporary Art Fair — Berlin, Mar 15–22",
  "trade-expo": "Global Trade Expo — Shanghai, Apr 5–12",
  "heritage": "Classical Heritage Show — Paris, May 18–25",
  "tech-summit": "Tech Innovation Summit — Tokyo, Jun 3–8"
};

var stallPrices = {
  "standard": 450,
  "premium": 890,
  "platinum": 1590
};

var stallNames = {
  "standard": "Standard Stall (3m × 3m) — $450",
  "premium": "Premium Stall (6m × 4m) — $890",
  "platinum": "Platinum Stall (9m × 6m) — $1,590"
};

var formData = {};

function goToStep(step) {
  for (var i = 1; i <= 4; i++) {
    var section = document.getElementById("step" + i);
    if (section) section.style.display = i === step ? "block" : "none";
  }

  document.querySelectorAll(".si-item").forEach(function (item) {
    var itemStep = parseInt(item.getAttribute("data-step"), 10);
    item.classList.toggle("active", itemStep <= step);
  });

  document.querySelectorAll(".si-line").forEach(function (line, idx) {
    line.classList.toggle("active", idx < step - 1);
  });

  if (step === 4) populateConfirmation();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getSelectedRadio(name) {
  var checked = document.querySelector('input[name="' + name + '"]:checked');
  return checked ? checked.value : null;
}

function populateConfirmation() {
  var exhib = getSelectedRadio("exhibition");
  var stall = getSelectedRadio("stallType");

  formData.exhibition = exhib;
  formData.stallType = stall;

  document.getElementById("confExhib").textContent = exhibNames[exhib] || "—";
  document.getElementById("confStall").textContent = stallNames[stall] || "—";

  var form = document.getElementById("detailsForm");
  if (form) {
    formData.name = form.name.value;
    formData.company = form.company.value;
    formData.email = form.email.value;
    formData.phone = form.phone.value;
  }

  document.getElementById("confName").textContent = formData.name || "—";
  document.getElementById("confCompany").textContent = formData.company || "—";
  document.getElementById("confEmail").textContent = formData.email || "—";
  document.getElementById("confPhone").textContent = formData.phone || "—";
  document.getElementById("confPrice").textContent = "$" + (stallPrices[stall] || 0);
}

document.addEventListener("DOMContentLoaded", function () {
  /* Details form submit → go to confirmation */
  var detailsForm = document.getElementById("detailsForm");
  if (detailsForm) {
    detailsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      goToStep(4);
    });
  }

  /* Confirm booking button */
  var confirmBtn = document.getElementById("confirmBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", function () {
      var card = document.querySelector(".confirm-card");
      var success = document.getElementById("successMsg");
      if (card) card.style.display = "none";
      if (success) {
        success.style.display = "block";
        success.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  /* Select card visual feedback */
  document.querySelectorAll('input[name="exhibition"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      document.querySelectorAll(".select-inner").forEach(function (inner) {
        inner.style.borderColor = "";
      });
    });
  });
});

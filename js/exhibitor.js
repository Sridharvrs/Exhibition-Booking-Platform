document.addEventListener("DOMContentLoaded", () => {

    const currentUser = JSON.parse(
        sessionStorage.getItem("StacklyCurrentUser")
    );

    if (!currentUser) {
        return;
    }

    /* =========================================
       DYNAMIC PROFILE NAME
    ========================================= */

    document.querySelectorAll(".profileName").forEach(element => {
        element.textContent = currentUser.name;
    });


    /* =========================================
       DYNAMIC AVATAR LETTER
    ========================================= */

    const firstLetter = currentUser.name
        ? currentUser.name.trim().charAt(0).toUpperCase()
        : "?";

    document.querySelectorAll(".avatarLetter").forEach(element => {
        element.textContent = firstLetter;
    });

});


(function(){
  "use strict";

  /* ---------- SIDEBAR NAVIGATION ---------- */
  var navItems    = document.querySelectorAll(".nav-item");
  var modules     = document.querySelectorAll(".module");
  var topbarCrumb = document.getElementById("topbarCrumb");

  var titles = {
    overview:"Overview", browse:"Browse exhibitions", floorplan:"Pick a stall",
    mybookings:"My bookings", invoices:"Invoices", company:"Company profile", support:"Support"
  };

  function activateModule(target){
    modules.forEach(function(m){ m.classList.toggle("active", m.id === target); });
    navItems.forEach(function(n){ n.classList.toggle("active", n.dataset.target === target); });
    topbarCrumb.textContent = titles[target] || target;
    window.scrollTo({top:0, behavior:"smooth"});
    closeSidebarOnMobile();
  }

  navItems.forEach(function(btn){
    btn.addEventListener("click", function(){ activateModule(btn.dataset.target); });
  });

  document.querySelectorAll("[data-nav]").forEach(function(btn){
    btn.addEventListener("click", function(){ activateModule(btn.dataset.nav); });
  });

  /* ---------- RESPONSIVE SIDEBAR TOGGLE ---------- */
  var sidebar    = document.getElementById("sidebar");
  var backdrop   = document.getElementById("backdrop");
  var menuToggle = document.getElementById("menuToggle");

  function openSidebar(){ sidebar.classList.add("open"); backdrop.classList.add("show"); }
  function closeSidebar(){ sidebar.classList.remove("open"); backdrop.classList.remove("show"); }
  function closeSidebarOnMobile(){ if (window.innerWidth <= 760) closeSidebar(); }

  menuToggle.addEventListener("click", function(){
    sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
  });
  backdrop.addEventListener("click", closeSidebar);
  window.addEventListener("resize", function(){ if (window.innerWidth > 760) closeSidebar(); });

  /* ---------- LOGOUT FLOW ---------- */
  var logoutModal   = document.getElementById("logoutModal");
  var loggedOutScreen = document.getElementById("loggedOutScreen");

  function showLogoutModal(){ logoutModal.classList.add("show"); }
  // function home(){ logoutModal.classList.add("show"); }
  function hideLogoutModal(){ logoutModal.classList.remove("show"); }

  document.getElementById("logoutBtn").addEventListener("click", showLogoutModal);
  document.getElementById("logoutBtnTop").addEventListener("click", showLogoutModal);
  document.getElementById("cancelLogout").addEventListener("click", hideLogoutModal);
  logoutModal.addEventListener("click", function(e){ if (e.target === logoutModal) hideLogoutModal(); });

  document.getElementById("confirmLogout").addEventListener("click", function(){
    hideLogoutModal();
    window.location.href = "index.html";
    // loggedOutScreen.classList.add("show");
  });
  // document.getElementById("loginAgain").addEventListener("click", function(){
  //   loggedOutScreen.classList.remove("show");
  //   activateModule("overview");
  // });


  /* ---------- FLOOR PLAN GENERATION ---------- */
  var STATUSES = ["available","available","mine","available","booked","available","blocked","available"];
  var floorGrid   = document.getElementById("floorGrid");
  var stallDetail = document.getElementById("stallDetail");
  var expoSelect  = document.getElementById("expoSelect");
  var hallPrefixes = {0:"A", 1:"B", 2:"C"};
  var priceByHall  = {0:"₹4,200", 1:"₹5,000", 2:"₹4,800"};

  function buildFloor(index){
    floorGrid.innerHTML = "";
    var prefix = hallPrefixes[index] || "A";
    var count = 32;
    for (var i = 1; i <= count; i++){
      var status = STATUSES[i % STATUSES.length];
      var cell = document.createElement("button");
      cell.className = "stall " + status;
      cell.type = "button";
      var num = prefix + "-" + (i < 10 ? "0" + i : i);
      cell.textContent = num;
      cell.dataset.num = num;
      cell.dataset.status = status;
      if (status === "available" || status === "mine"){
        cell.addEventListener("click", function(){ selectStall(this, index); });
      }
      floorGrid.appendChild(cell);
    }
  }

  function selectStall(cell, hallIndex){
    document.querySelectorAll(".stall.selected").forEach(function(c){ c.classList.remove("selected"); });
    cell.classList.add("selected");
    var status = cell.dataset.status;
    var num = cell.dataset.num;
    var price = priceByHall[hallIndex] || "₹4,200";

    if (status === "mine"){
      stallDetail.innerHTML =
        "<h3>Stall " + num + "</h3>" +
        "<p class=\"muted\">This is already yours — confirmed.</p>" +
        "<dl><dt>Size</dt><dd>3m × 3m</dd><dt>Price / day</dt><dd>" + price + "</dd></dl>";
      return;
    }

    stallDetail.innerHTML =
      "<h3>Stall " + num + "</h3>" +
      "<p class=\"muted\">Available</p>" +
      "<dl><dt>Size</dt><dd>3m × 3m</dd><dt>Price / day</dt><dd>" + price + "</dd></dl>" +
      "<button class=\"primary-btn\" id=\"requestBookingBtn\">Request booking</button>";

    document.getElementById("requestBookingBtn").addEventListener("click", function(){
      this.textContent = "Request sent ✓";
      this.disabled = true;
      cell.classList.remove("available");
      cell.classList.add("mine");
    });
  }

  expoSelect.addEventListener("change", function(){ buildFloor(expoSelect.selectedIndex); });
  buildFloor(0);

  /* ---------- MY BOOKINGS TABLE ---------- */
  var bookingsData = [
    {exhib:"Textile & Craft Expo", stall:"A-14", dates:"14–17 Jun", amount:"₹12,600", status:"confirmed"},
    {exhib:"Textile & Craft Expo", stall:"A-05", dates:"14–17 Jun", amount:"₹12,600", status:"pending"},
    {exhib:"Auto Components Meet", stall:"C-22", dates:"03–06 Jul", amount:"₹19,200", status:"confirmed"},
    {exhib:"Consumer Electronics Fair", stall:"B-18", dates:"12–15 Sep", amount:"₹24,800", status:"cancelled"}
  ];

  var bookingsBody = document.getElementById("bookingsBody");
  var chipClass = {pending:"chip-amber", confirmed:"chip-green", cancelled:"chip-red"};
  var chipLabel = {pending:"Pending", confirmed:"Confirmed", cancelled:"Cancelled"};

  function renderBookings(filter){
    bookingsBody.innerHTML = "";
    bookingsData
      .filter(function(b){ return filter === "all" || !filter || b.status === filter; })
      .forEach(function(b, i){
        var tr = document.createElement("tr");
        var action = b.status === "pending"
          ? "<button class=\"row-btn cancel\" data-i=\"" + i + "\">Cancel</button>"
          : b.status === "confirmed"
          ? "<button class=\"row-btn\">View details</button>"
          : "<button class=\"row-btn\">Rebook</button>";
        tr.innerHTML =
          "<td><strong>" + b.exhib + "</strong></td>" +
          "<td>" + b.stall + "</td>" +
          "<td>" + b.dates + "</td>" +
          "<td>" + b.amount + "</td>" +
          "<td><span class=\"chip " + chipClass[b.status] + "\">" + chipLabel[b.status] + "</span></td>" +
          "<td>" + action + "</td>";
        bookingsBody.appendChild(tr);
      });

    bookingsBody.querySelectorAll("[data-i]").forEach(function(btn){
      btn.addEventListener("click", function(){
        bookingsData[+btn.dataset.i].status = "cancelled";
        renderBookings(getActiveFilter());
      });
    });
  }

  function getActiveFilter(){
    var active = document.querySelector('#mybookings .chip-filter.active');
    return active ? active.dataset.status : "all";
  }

  document.querySelectorAll('#mybookings .chip-filter').forEach(function(chip){
    chip.addEventListener("click", function(){
      document.querySelectorAll('#mybookings .chip-filter').forEach(function(c){ c.classList.remove("active"); });
      chip.classList.add("active");
      renderBookings(chip.dataset.status);
    });
  });

  renderBookings("all");

  /* ---------- BROWSE FILTER CHIPS (cosmetic) ---------- */
  document.querySelectorAll('#browse .chip-filter').forEach(function(chip){
    chip.addEventListener("click", function(){
      document.querySelectorAll('#browse .chip-filter').forEach(function(c){ c.classList.remove("active"); });
      chip.classList.add("active");
    });
  });

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll(".faq-item").forEach(function(item){
    item.querySelector(".faq-q").addEventListener("click", function(){
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(function(i){ i.classList.remove("open"); });
      if (!wasOpen) item.classList.add("open");
    });
  });

  /* ---------- FORMS (cosmetic save states) ---------- */
  function bindCosmeticSave(formId, doneText){
    var form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var btn = form.querySelector("button");
      var original = btn.textContent;
      btn.textContent = doneText;
      setTimeout(function(){ btn.textContent = original; }, 1600);
    });
  }
  bindCosmeticSave("profileForm", "Saved ✓");
  bindCosmeticSave("supportForm", "Sent ✓");

})();

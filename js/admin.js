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
  var navItems   = document.querySelectorAll(".nav-item");
  var modules    = document.querySelectorAll(".module");
  var topbarCrumb = document.getElementById("topbarCrumb");

  var titles = {
    overview:"Overview", exhibitions:"Exhibitions", halls:"Halls & Stalls",
    bookings:"Bookings", exhibitors:"Exhibitors", reports:"Reports", settings:"Settings"
  };

  function activateModule(target){
    modules.forEach(function(m){ m.classList.toggle("active", m.id === target); });
    navItems.forEach(function(n){ n.classList.toggle("active", n.dataset.target === target); });
    topbarCrumb.textContent = titles[target] || target;
    document.querySelector(".content").scrollTo({top:0});
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
  var sidebar   = document.getElementById("sidebar");
  var backdrop  = document.getElementById("backdrop");
  var menuToggle= document.getElementById("menuToggle");

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
  var STATUSES = ["available","available","available","booked","booked","reserved","blocked","available"];
  var floorGrid = document.getElementById("floorGrid");
  var stallDetail = document.getElementById("stallDetail");
  var hallSelect = document.getElementById("hallSelect");

  var hallPrefixes = {0:"A", 1:"B", 2:"C"};

  function buildFloor(hallIndex){
    floorGrid.innerHTML = "";
    var prefix = hallPrefixes[hallIndex] || "A";
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
      if (status !== "blocked"){
        cell.addEventListener("click", function(){ selectStall(this); });
      }
      floorGrid.appendChild(cell);
    }
  }

  function selectStall(cell){
    document.querySelectorAll(".stall.selected").forEach(function(c){ c.classList.remove("selected"); });
    cell.classList.add("selected");
    var status = cell.dataset.status;
    var num = cell.dataset.num;
    var statusLabel = {available:"Available", booked:"Booked", reserved:"Reserved"}[status] || status;
    var exhibitorLine = status === "booked"
      ? "<dt>Exhibitor</dt><dd>Kavya Textiles</dd>"
      : status === "reserved"
      ? "<dt>Exhibitor</dt><dd>Held — awaiting payment</dd>"
      : "<dt>Exhibitor</dt><dd>— unassigned —</dd>";

    stallDetail.innerHTML =
      "<h3>Stall " + num + "</h3>" +
      "<p class=\"muted\">" + statusLabel + "</p>" +
      "<dl>" +
        "<dt>Size</dt><dd>3m × 3m</dd>" +
        exhibitorLine +
        "<dt>Price / day</dt><dd>₹4,200</dd>" +
      "</dl>";
  }

  hallSelect.addEventListener("change", function(){
    buildFloor(hallSelect.selectedIndex);
  });
  buildFloor(0);

  /* ---------- BOOKINGS TABLE ---------- */
  var bookingsData = [
    {id:"BK-1042", exhibitor:"Kavya Textiles", stall:"A-14", date:"07 Jun", amount:"₹12,600", status:"pending"},
    {id:"BK-1043", exhibitor:"Nutrifresh Foods", stall:"B-06", date:"07 Jun", amount:"₹9,800", status:"pending"},
    {id:"BK-1039", exhibitor:"Velocity Auto Parts", stall:"C-22", date:"04 Jun", amount:"₹16,400", status:"approved"},
    {id:"BK-1031", exhibitor:"Sundar Handlooms", stall:"A-31", date:"29 May", amount:"₹8,400", status:"rejected"},
    {id:"BK-1044", exhibitor:"Bloom Paper Co.", stall:"C-11", date:"08 Jun", amount:"₹11,200", status:"pending"},
    {id:"BK-1045", exhibitor:"Greenfield Tools", stall:"C-19", date:"08 Jun", amount:"₹13,000", status:"pending"},
    {id:"BK-1046", exhibitor:"Kavya Textiles", stall:"A-05", date:"09 Jun", amount:"₹12,600", status:"pending"},
    {id:"BK-1047", exhibitor:"Nutrifresh Foods", stall:"B-09", date:"09 Jun", amount:"₹9,800", status:"pending"},
    {id:"BK-1030", exhibitor:"Velocity Auto Parts", stall:"C-02", date:"27 May", amount:"₹16,400", status:"approved"}
  ];

  var bookingsBody = document.getElementById("bookingsBody");
  var chipClass = {pending:"chip-amber", approved:"chip-green", rejected:"chip-red"};
  var chipLabel = {pending:"Pending", approved:"Approved", rejected:"Rejected"};

  function renderBookings(filter){
    bookingsBody.innerHTML = "";
    bookingsData
      .filter(function(b){ return !filter || b.status === filter; })
      .forEach(function(b){
        var tr = document.createElement("tr");
        var actionsHtml = b.status === "pending"
          ? "<button class=\"row-btn approve\" data-act=\"approve\" data-id=\"" + b.id + "\">Approve</button> " +
            "<button class=\"row-btn reject\" data-act=\"reject\" data-id=\"" + b.id + "\">Reject</button>"
          : "<button class=\"row-btn\">View</button>";
        tr.innerHTML =
          "<td><strong>" + b.id + "</strong></td>" +
          "<td>" + b.exhibitor + "</td>" +
          "<td>" + b.stall + "</td>" +
          "<td>" + b.date + "</td>" +
          "<td>" + b.amount + "</td>" +
          "<td><span class=\"chip " + chipClass[b.status] + "\">" + chipLabel[b.status] + "</span></td>" +
          "<td>" + actionsHtml + "</td>";
        bookingsBody.appendChild(tr);
      });

    bookingsBody.querySelectorAll("[data-act]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var item = bookingsData.find(function(b){ return b.id === btn.dataset.id; });
        if (item){
          item.status = btn.dataset.act === "approve" ? "approved" : "rejected";
          renderBookings(getActiveBookingFilter());
          updatePendingPill();
        }
      });
    });
  }

  function getActiveBookingFilter(){
    var active = document.querySelector('#bookings .chip-filter.active');
    return active ? active.dataset.status : null;
  }

  document.querySelectorAll('#bookings .chip-filter').forEach(function(chip){
    chip.addEventListener("click", function(){
      document.querySelectorAll('#bookings .chip-filter').forEach(function(c){ c.classList.remove("active"); });
      chip.classList.add("active");
      renderBookings(chip.dataset.status);
    });
  });

  function updatePendingPill(){
    var count = bookingsData.filter(function(b){ return b.status === "pending"; }).length;
    document.getElementById("pendingPill").textContent = count;
  }

  renderBookings("pending");
  updatePendingPill();

  /* ---------- REVENUE CHART ---------- */
  var revenueChart = document.getElementById("revenueChart");
  var months = [
    {m:"Jan", v:62}, {m:"Feb", v:74}, {m:"Mar", v:58}, {m:"Apr", v:88},
    {m:"May", v:96}, {m:"Jun", v:70}
  ];
  months.forEach(function(item){
    var col = document.createElement("div");
    col.className = "chart-bar";
    col.innerHTML = "<div class=\"fill\" style=\"height:" + item.v + "%\"></div><span>" + item.m + "</span>";
    revenueChart.appendChild(col);
  });

  /* ---------- SETTINGS FORM (cosmetic) ---------- */
  var profileForm = document.getElementById("profileForm");
  profileForm.addEventListener("submit", function(e){
    e.preventDefault();
    var btn = profileForm.querySelector("button");
    var original = btn.textContent;
    btn.textContent = "Saved ✓";
    setTimeout(function(){ btn.textContent = original; }, 1600);
  });

})();

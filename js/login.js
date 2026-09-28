/* ==========================================================================
   login.js — Stackly Client Portal
   Role selection, validation, session storage, login feedback & redirects
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  "use strict";

  /* =========================================
     ELEMENTS
  ========================================= */

  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  const roleButtons = document.querySelectorAll(".role-card");

  const selectedRoleText =
    document.getElementById("selectedRoleText");

  const selectedRoleIcon =
    document.getElementById("selectedRoleIcon");

  const email =
    document.getElementById("email");

  const password =
    document.getElementById("password");

  const rememberMe =
    document.getElementById("rememberMe");

  const passwordToggle =
    document.getElementById("passwordToggle");

  const forgotPassword =
    document.getElementById("forgotPassword");

  const loginMessage =
    document.getElementById("loginMessage");

  const loginSubmit =
    document.getElementById("loginSubmit");


  /* =========================================
     SELECTED ROLE
  ========================================= */

  let selectedRole = "admin";


  /* =========================================
     PASSWORD SHOW / HIDE
  ========================================= */

  if (passwordToggle && password) {

    passwordToggle.addEventListener("click", () => {

      if (password.type === "password") {

        password.type = "text";

        passwordToggle.setAttribute(
          "aria-label",
          "Hide password"
        );

        const icon =
          passwordToggle.querySelector("i");

        if (icon) {
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        }

      } else {

        password.type = "password";

        passwordToggle.setAttribute(
          "aria-label",
          "Show password"
        );

        const icon =
          passwordToggle.querySelector("i");

        if (icon) {
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }

      }

    });

  }


  /* =========================================
     EMAIL VALIDATION
  ========================================= */

  function validateEmail(value) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  }


  /* =========================================
     PASSWORD VALIDATION
     
     Minimum:
     8 characters
     1 uppercase
     1 lowercase
     1 number
     1 special character
  ========================================= */

  function validatePassword(value) {

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=])[A-Za-z\d@$!%*?&^#()_+\-=]{8,}$/;

    return passwordRegex.test(value);

  }


  /* =========================================
     SHOW FIELD ERROR
  ========================================= */

  function showFieldError(field) {

    if (!field) return;

    const group =
      field.closest(".form-group");

    if (group) {
      group.classList.add("invalid");
    }

  }


  /* =========================================
     CLEAR FIELD ERROR
  ========================================= */

  function clearFieldError(field) {

    if (!field) return;

    const group =
      field.closest(".form-group");

    if (group) {
      group.classList.remove("invalid");
    }

  }


  /* =========================================
     CLEAR LOGIN MESSAGE
  ========================================= */

  function clearMessage() {

    if (!loginMessage) return;

    loginMessage.textContent = "";
    loginMessage.removeAttribute("style");

  }


  /* =========================================
     ROLE SELECTOR
  ========================================= */

  roleButtons.forEach((button) => {

    button.addEventListener("click", () => {

      /* Remove active state from all buttons */

      roleButtons.forEach((item) => {

        item.classList.remove("active");

        item.setAttribute(
          "aria-selected",
          "false"
        );

      });


      /* Add active state */

      button.classList.add("active");

      button.setAttribute(
        "aria-selected",
        "true"
      );


      /* Get selected role */

      selectedRole =
        button.dataset.role || "admin";


      /* =====================================
         UPDATE SELECTED ROLE TEXT + ICON
      ===================================== */

      if (selectedRoleText) {

        selectedRoleText.textContent =
          selectedRole === "admin"
            ? "Admin"
            : "Exhibitor";

      }


      if (selectedRoleIcon) {

        selectedRoleIcon.className =
          selectedRole === "admin"
            ? "fas fa-shield-halved"
            : "fas fa-store";

      }


      /* Clear previous message */

      clearMessage();

    });

  });


  /* =========================================
     EMAIL INPUT
  ========================================= */

  if (email) {

    email.addEventListener("input", () => {

      clearFieldError(email);
      clearMessage();

    });

  }


  /* =========================================
     PASSWORD INPUT
  ========================================= */

  if (password) {

    password.addEventListener("input", () => {

      clearFieldError(password);
      clearMessage();

    });

  }


  /* =========================================
     FORGOT PASSWORD
  ========================================= */

  if (forgotPassword) {

    forgotPassword.addEventListener("click", (e) => {

      e.preventDefault();

      if (!loginMessage) return;

      loginMessage.style.color = "var(--accent, #c89b3c)";

      loginMessage.textContent =
        "Password reset is available through the Stackly portal.";

    });

  }


  /* =========================================
     LOGIN FORM SUBMIT
  ========================================= */

  loginForm.addEventListener("submit", (e) => {

    e.preventDefault();


    /* Clear previous errors */

    clearFieldError(email);
    clearFieldError(password);
    clearMessage();


    /* Get values */

    const emailValue =
      email ? email.value.trim() : "";

    const passwordValue =
      password ? password.value : "";


    let valid = true;


    /* =====================================
       EMAIL VALIDATION
    ===================================== */

    if (
      !emailValue ||
      !validateEmail(emailValue)
    ) {

      showFieldError(email);

      valid = false;

    }


    /* =====================================
       PASSWORD VALIDATION
    ===================================== */

    if (passwordValue === "") {

      showFieldError(password);

      valid = false;

    } else if (!validatePassword(passwordValue)) {

      showFieldError(password);

      valid = false;

    }


    /* =====================================
       STOP IF INVALID
    ===================================== */

    if (!valid) {

      if (loginMessage) {

        loginMessage.style.color = "#c94b43";

        loginMessage.textContent =
          "Please enter a valid email and password.";

      }

      return;

    }


    /* =====================================
       SUBMIT BUTTON
    ===================================== */

    if (!loginSubmit) return;


    const originalHTML =
      loginSubmit.innerHTML;


    loginSubmit.disabled = true;

    loginSubmit.classList.add("loading");


    loginSubmit.innerHTML = `
      <span>Signing in...</span>
      <i class="fas fa-spinner fa-spin"></i>
    `;


    /* =====================================
       LOGIN PROCESS
    ===================================== */

    setTimeout(() => {


      /* =====================================
         CREATE CURRENT USER
      ===================================== */

      const currentUser = {

        name:
          emailValue.split("@")[0],

        email:
          emailValue,

        role:
          selectedRole === "admin"
            ? "Admin"
            : "Exhibitor"

      };


      /* =====================================
         REMEMBER DEVICE
      ===================================== */

      if (rememberMe) {

        if (rememberMe.checked) {

          localStorage.setItem(
            "StacklyRememberDevice",
            "true"
          );

        } else {

          localStorage.removeItem(
            "StacklyRememberDevice"
          );

        }

      }


      /* =====================================
         SAVE SESSION
      ===================================== */

      sessionStorage.setItem(
        "StacklyCurrentUser",
        JSON.stringify(currentUser)
      );


      /* =====================================
         SUCCESS MESSAGE
      ===================================== */

      if (loginMessage) {

        loginMessage.style.color =
          "var(--teal, #2f8f83)";

        loginMessage.textContent =
          `Welcome back. Signed in as ${currentUser.role}.`;

      }


      /* =====================================
         RESET BUTTON
      ===================================== */

      loginSubmit.classList.remove("loading");

      loginSubmit.innerHTML =
        originalHTML;

      loginSubmit.disabled = false;


      /* =====================================
         REDIRECT
      ===================================== */

      setTimeout(() => {

        if (selectedRole === "admin") {

          window.location.href =
            "admin-dashboard.html";

        } else {

          window.location.href =
            "exhibitor-dashboard.html";

        }

      }, 1000);


    }, 1200);

  });


  /* =========================================
     RESET LOGIN PAGE ON BACK / FORWARD
  ========================================= */

  window.addEventListener("pageshow", () => {

    /* Reset form */

    loginForm.reset();


    /* Reset email */

    if (email) {
      email.value = "";
    }


    /* Reset password */

    if (password) {

      password.value = "";
      password.type = "password";

    }


    /* Reset password icon */

    if (passwordToggle) {

      passwordToggle.setAttribute(
        "aria-label",
        "Show password"
      );

      const icon =
        passwordToggle.querySelector("i");

      if (icon) {

        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");

      }

    }


    /* Clear message */

    clearMessage();


    /* Reset role buttons */

    roleButtons.forEach((button, index) => {

      const isFirst =
        index === 0;

      button.classList.toggle(
        "active",
        isFirst
      );

      button.setAttribute(
        "aria-selected",
        isFirst ? "true" : "false"
      );

    });


    /* Reset selected role */

    selectedRole = "admin";


    /* Reset selected role text */

    if (selectedRoleText) {

      selectedRoleText.textContent =
        "Admin";

    }


    /* Reset selected role icon */

    if (selectedRoleIcon) {

      selectedRoleIcon.className =
        "fas fa-shield-halved";

    }

  });

});
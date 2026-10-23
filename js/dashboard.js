(function () {
  "use strict";

  var sessionKey = "zp_teacher_demo_session";
  var usersPromise;
  var loginPanel = document.getElementById("teacher-login-panel");
  var dashboardPanel = document.getElementById("teacher-dashboard-panel");
  var loginForm = document.getElementById("teacher-login-form");
  var loginMessage = document.getElementById("teacher-login-message");
  var statusMessage = document.getElementById("dashboard-status");

  function isSignedIn() {
    return Boolean(sessionStorage.getItem(sessionKey));
  }

  function loadUsers() {
    if (!usersPromise) {
      usersPromise = fetch("data/teacher-users.json", { cache: "no-store" })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Unable to load teacher accounts.");
          }
          return response.json();
        });
    }

    return usersPromise;
  }

  function hashPassword(value) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)).then(function (buffer) {
      return Array.from(new Uint8Array(buffer)).map(function (byte) {
        return byte.toString(16).padStart(2, "0");
      }).join("");
    });
  }

  function setStatus(message, isError) {
    if (!statusMessage) {
      return;
    }

    statusMessage.textContent = message;
    statusMessage.classList.toggle("error-message", Boolean(isError));
    statusMessage.classList.toggle("success-message", !isError);
  }

  function setSignedInState() {
    var signedIn = isSignedIn();
    loginPanel.hidden = signedIn;
    dashboardPanel.hidden = !signedIn;
    document.getElementById("teacher-signout").hidden = !signedIn;

    if (signedIn) {
      fillForms();
      renderDashboardNotices();
    }
  }

  function inputValue(id) {
    var input = document.getElementById(id);
    return input ? input.value.trim() : "";
  }

  function setInput(id, value) {
    var input = document.getElementById(id);
    if (input) {
      input.value = value || "";
    }
  }

  function fillForms() {
    var data = window.ZPSiteData.read();
    var contact = data.contact;
    var school = data.school;

    setInput("contact-address-road", contact.addressRoad);
    setInput("contact-address-naka", contact.addressNaka);
    setInput("contact-address-golani", contact.addressGolani);
    setInput("contact-address-vasai", contact.addressVasai);
    setInput("contact-address-state", contact.addressState);
    setInput("principal-name", contact.principalName);
    setInput("principal-phone", contact.principalPhone);
    setInput("principal-email", contact.principalEmail);
    setInput("school-contact-name", contact.schoolContactName);
    setInput("school-phone", contact.schoolPhone);
    setInput("school-email", contact.schoolEmail);
    setInput("school-medium", school.medium);
    setInput("school-students", school.students);
    setInput("school-teachers", school.teachers);
    setInput("school-timing", school.timing);
  }

  function renderDashboardNotices() {
    var body = document.getElementById("dashboard-notice-body");
    var notices = window.ZPSiteData.read().notices;

    body.textContent = "";
    notices.forEach(function (notice, index) {
      var row = document.createElement("tr");
      var date = document.createElement("td");
      var title = document.createElement("td");
      var category = document.createElement("td");
      var actions = document.createElement("td");
      var remove = document.createElement("button");

      date.textContent = notice.date;
      title.textContent = notice.titleEn;
      category.textContent = notice.categoryEn;
      remove.className = "button button-danger";
      remove.type = "button";
      remove.textContent = "Delete";
      remove.addEventListener("click", function () {
        var data = window.ZPSiteData.read();
        data.notices.splice(index, 1);
        window.ZPSiteData.save(data);
        renderDashboardNotices();
        window.ZPSiteData.applyPublicData();
        setStatus("Notice deleted in this browser demo.", false);
      });
      actions.appendChild(remove);
      row.appendChild(date);
      row.appendChild(title);
      row.appendChild(category);
      row.appendChild(actions);
      body.appendChild(row);
    });
  }

  function saveContact(event) {
    event.preventDefault();
    var data = window.ZPSiteData.read();

    data.contact = {
      addressRoad: inputValue("contact-address-road"),
      addressNaka: inputValue("contact-address-naka"),
      addressGolani: inputValue("contact-address-golani"),
      addressVasai: inputValue("contact-address-vasai"),
      addressState: inputValue("contact-address-state"),
      principalName: inputValue("principal-name"),
      principalPhone: inputValue("principal-phone"),
      principalEmail: inputValue("principal-email"),
      schoolContactName: inputValue("school-contact-name"),
      schoolPhone: inputValue("school-phone"),
      schoolEmail: inputValue("school-email")
    };
    window.ZPSiteData.save(data);
    window.ZPSiteData.applyPublicData();
    setStatus("Contact details saved in this browser demo.", false);
  }

  function saveSchool(event) {
    event.preventDefault();
    var data = window.ZPSiteData.read();

    data.school = {
      medium: inputValue("school-medium"),
      students: inputValue("school-students"),
      teachers: inputValue("school-teachers"),
      timing: inputValue("school-timing")
    };
    window.ZPSiteData.save(data);
    window.ZPSiteData.applyPublicData();
    setStatus("School information saved in this browser demo.", false);
  }

  function addNotice(event) {
    event.preventDefault();
    var data = window.ZPSiteData.read();
    var title = inputValue("notice-title");

    if (!title) {
      setStatus("Enter a notice title before saving.", true);
      return;
    }

    data.notices.unshift({
      date: inputValue("notice-date") || "To be updated",
      titleEn: title,
      titleMr: inputValue("notice-title-marathi") || title,
      categoryEn: inputValue("notice-category") || "General",
      categoryMr: inputValue("notice-category-marathi") || inputValue("notice-category") || "सामान्य",
      url: inputValue("notice-url") || "#"
    });
    window.ZPSiteData.save(data);
    document.getElementById("notice-form").reset();
    renderDashboardNotices();
    window.ZPSiteData.applyPublicData();
    setStatus("Notice added in this browser demo.", false);
  }

  function resetDemoData() {
    window.ZPSiteData.save(JSON.parse(JSON.stringify(window.ZPSiteData.defaults)));
    fillForms();
    renderDashboardNotices();
    window.ZPSiteData.applyPublicData();
    setStatus("Demo data reset to the starting values.", false);
  }

  document.addEventListener("DOMContentLoaded", function () {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var id = inputValue("teacher-username");
      var passwordValue = inputValue("teacher-password");
      var submitButton = loginForm.querySelector("button[type='submit']");

      loginMessage.textContent = "Checking sign-in details...";
      loginMessage.classList.remove("error-message");
      if (submitButton) {
        submitButton.disabled = true;
      }

      loadUsers().then(function (data) {
        return hashPassword(passwordValue).then(function (hash) {
          var users = Array.isArray(data.users) ? data.users : [];
          var user = users.find(function (entry) {
            return entry.active !== false && entry.id === id && entry.passwordHash === hash;
          });

          if (!user) {
            throw new Error("invalid");
          }

          sessionStorage.setItem(sessionKey, user.id);
          loginMessage.textContent = "";
          loginForm.reset();
          setSignedInState();
        });
      }).catch(function (error) {
        if (error && error.message === "invalid") {
          loginMessage.textContent = "Sign-in failed. Check the ID and password.";
        } else {
          loginMessage.textContent = "Sign-in is unavailable. The account file could not be loaded.";
        }
        loginMessage.classList.add("error-message");
      }).finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
        }
      });
    });

    document.getElementById("teacher-signout").addEventListener("click", function () {
      sessionStorage.removeItem(sessionKey);
      setSignedInState();
    });
    document.getElementById("notice-form").addEventListener("submit", addNotice);
    document.getElementById("contact-form").addEventListener("submit", saveContact);
    document.getElementById("school-form").addEventListener("submit", saveSchool);
    document.getElementById("reset-demo-data").addEventListener("click", resetDemoData);
    setSignedInState();
  });
})();

(function () {
  "use strict";

  var storageKey = "zp_school_site_data";
  var defaultData = {
    notices: [
      {
        date: "10/09/2026",
        titleEn: "Examination Notice",
        titleMr: "परीक्षा सूचना",
        categoryEn: "Academic",
        categoryMr: "शैक्षणिक",
        url: "documents/examination-notice.pdf"
      },
      {
        date: "05/09/2026",
        titleEn: "Holiday Notice",
        titleMr: "सुट्टीची सूचना",
        categoryEn: "General",
        categoryMr: "सामान्य",
        url: "documents/holiday-notice.pdf"
      },
      {
        date: "01/09/2026",
        titleEn: "Parent Meeting",
        titleMr: "पालक सभा",
        categoryEn: "Meeting",
        categoryMr: "सभा",
        url: "documents/parent-meeting.pdf"
      }
    ],
    contact: {
      addressRoad: "Gokhivare Road",
      addressNaka: "Gokhivare Naka",
      addressGolani: "Golani Naka",
      addressVasai: "Vasai East",
      addressState: "Maharashtra – 401208",
      principalName: "Brijdin",
      principalPhone: "+91 8698734469",
      principalEmail: "",
      schoolContactName: "Alka",
      schoolPhone: "+91 8097918966",
      schoolEmail: ""
    },
    school: {
      medium: "Marathi",
      students: "525",
      teachers: "17",
      timing: "To be updated"
    }
  };

  function copy(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function read() {
    var saved;

    try {
      saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    } catch (error) {
      saved = null;
    }

    if (!saved || !Array.isArray(saved.notices)) {
      return copy(defaultData);
    }

    var school = Object.assign({}, defaultData.school, saved.school || {});

    // Upgrade the earlier placeholder defaults for existing browser previews.
    if (school.medium === "To be updated") {
      school.medium = defaultData.school.medium;
    }
    if (school.students === "To be updated") {
      school.students = defaultData.school.students;
    }
    if (school.teachers === "To be updated") {
      school.teachers = defaultData.school.teachers;
    }

    return {
      notices: saved.notices,
      contact: Object.assign({}, defaultData.contact, saved.contact || {}),
      school: school
    };
  }

  function save(data) {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  function getLanguage() {
    return document.documentElement.lang === "mr" ? "mr" : "en";
  }

  function translation(key, fallback) {
    var language = getLanguage();
    var dictionary = window.translations && window.translations[language];
    return (dictionary && dictionary[key]) || fallback;
  }

  function setText(id, value) {
    var element = document.getElementById(id);
    if (element && value) {
      element.textContent = value;
    }
  }

  function renderNoticeTable(data) {
    var body = document.getElementById("notice-table-body");
    var latest = document.getElementById("latest-notice-list");
    var language = getLanguage();

    if (body) {
      body.textContent = "";
      data.notices.forEach(function (notice) {
        var row = document.createElement("tr");
        var date = document.createElement("td");
        var title = document.createElement("td");
        var category = document.createElement("td");
        var viewCell = document.createElement("td");
        var link = document.createElement("a");

        date.textContent = notice.date;
        title.textContent = language === "mr" ? notice.titleMr || notice.titleEn : notice.titleEn;
        category.textContent = language === "mr" ? notice.categoryMr || notice.categoryEn : notice.categoryEn;
        link.className = "button";
        link.href = notice.url || "#";
        link.textContent = translation("view", "View");
        viewCell.appendChild(link);
        row.appendChild(date);
        row.appendChild(title);
        row.appendChild(category);
        row.appendChild(viewCell);
        body.appendChild(row);
      });
    }

    if (latest) {
      latest.textContent = "";
      data.notices.slice(0, 4).forEach(function (notice) {
        var item = document.createElement("li");
        var link = document.createElement("a");
        link.href = "notices.html";
        link.textContent = language === "mr" ? notice.titleMr || notice.titleEn : notice.titleEn;
        item.appendChild(link);
        latest.appendChild(item);
      });
    }
  }

  function renderContact(data) {
    var contact = data.contact;
    setText("public-address-road", contact.addressRoad);
    setText("public-address-naka", contact.addressNaka);
    setText("public-address-golani", contact.addressGolani);
    setText("public-address-vasai", contact.addressVasai);
    setText("public-address-state", contact.addressState);
    setText("public-address-summary", [contact.addressRoad, contact.addressNaka, contact.addressGolani, contact.addressVasai, contact.addressState].filter(Boolean).join(", "));
    setText("public-principal-name", contact.principalName);
    setText("public-principal-phone", contact.principalPhone);
    setText("public-principal-email", contact.principalEmail);
    setText("public-school-contact-name", contact.schoolContactName);
    setText("public-school-phone", contact.schoolPhone);
    setText("public-school-email", contact.schoolEmail);
  }

  function renderSchool(data) {
    var medium = data.school.medium;
    var timing = data.school.timing;

    if (medium === "Marathi") {
      medium = translation("medium_marathi_value", "Marathi");
    }
    if (timing === "To be updated") {
      timing = translation("to_be_updated", "To be updated");
    }

    setText("public-school-medium", medium);
    setAnimatedNumber("public-school-students", data.school.students);
    setAnimatedNumber("public-school-teachers", data.school.teachers);
    setText("public-school-timing", timing);
  }

  function setAnimatedNumber(id, value) {
    var element = document.getElementById(id);
    var target = Number.parseInt(String(value).replace(/[^0-9]/g, ""), 10);

    if (!element || Number.isNaN(target)) {
      setText(id, value);
      return;
    }

    if (element.getAttribute("data-stat-target") === String(target)) {
      return;
    }

    element.setAttribute("data-stat-target", String(target));

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.textContent = String(target);
      return;
    }

    var start = performance.now();
    var duration = 900;

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    element.textContent = "0";
    window.requestAnimationFrame(step);
  }

  function applyPublicData() {
    var data = read();
    renderNoticeTable(data);
    renderContact(data);
    renderSchool(data);
  }

  window.ZPSiteData = {
    defaults: copy(defaultData),
    read: read,
    save: save,
    applyPublicData: applyPublicData,
    storageKey: storageKey
  };

  document.addEventListener("DOMContentLoaded", applyPublicData);
})();

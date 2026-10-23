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
      medium: "To be updated",
      students: "To be updated",
      teachers: "To be updated",
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

    return {
      notices: saved.notices,
      contact: Object.assign({}, defaultData.contact, saved.contact || {}),
      school: Object.assign({}, defaultData.school, saved.school || {})
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
    setText("public-school-medium", data.school.medium);
    setText("public-school-students", data.school.students);
    setText("public-school-teachers", data.school.teachers);
    setText("public-school-timing", data.school.timing);
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

(function () {
  "use strict";

  function readLanguage() {
    try {
      return localStorage.getItem("language") === "mr" ? "mr" : "en";
    } catch (error) {
      return "en";
    }
  }

  function translateAttribute(attribute, dataAttribute, language) {
    document.querySelectorAll("[" + dataAttribute + "]").forEach(function (element) {
      var key = element.getAttribute(dataAttribute);
      var value = translations[language][key];
      if (value !== undefined) {
        element.setAttribute(attribute, value);
      }
    });
  }

  function setLanguage(language) {
    if (!translations[language]) {
      language = "en";
    }

    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      var key = element.getAttribute("data-i18n");
      var value = translations[language][key];
      if (value !== undefined) {
        element.textContent = value;
      }
    });

    translateAttribute("aria-label", "data-i18n-aria", language);
    translateAttribute("title", "data-i18n-title", language);
    translateAttribute("alt", "data-i18n-alt", language);

    document.querySelectorAll("[data-lang]").forEach(function (button) {
      var active = button.getAttribute("data-lang") === language;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    document.querySelectorAll("[data-language-toggle]").forEach(function (button) {
      var labelKey = language === "mr" ? "switch_to_english" : "switch_to_marathi";
      var label = translations[language][labelKey];
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    });

    try {
      localStorage.setItem("language", language);
    } catch (error) {
      // Language preference is optional when storage is unavailable.
    }

    if (typeof window.updateTextbookLanguage === "function") {
      window.updateTextbookLanguage(language);
    }

    if (window.ZPSiteData && typeof window.ZPSiteData.applyPublicData === "function") {
      window.ZPSiteData.applyPublicData();
    }
  }

  function getTranslation(language, key) {
    return translations[language][key] || translations.en[key] || key;
  }

  function renderTextbooks(language, selectedClass) {
    var grid = document.getElementById("textbook-grid");
    var title = document.getElementById("textbook-class-title");
    var books = window.textbookData && window.textbookData[selectedClass];
    var className = getTranslation(language, "class_" + selectedClass);

    if (!grid || !title || !books) {
      return;
    }

    title.textContent = getTranslation(language, "textbooks_for_class").replace("{class}", className);
    grid.textContent = "";

    books.forEach(function (book) {
      var card = document.createElement("article");
      var cardTitle = document.createElement("h5");
      var subject = document.createElement("p");
      var medium = document.createElement("p");
      var link = document.createElement("a");
      var subjectLabel = document.createElement("strong");
      var mediumLabel = document.createElement("strong");

      card.className = "textbook-card";
      cardTitle.textContent = language === "mr" ? book.titleMr : book.titleEn;
      subject.className = "textbook-meta";
      medium.className = "textbook-meta";
      subjectLabel.textContent = getTranslation(language, "textbook_subject") + ": ";
      mediumLabel.textContent = getTranslation(language, "textbook_language") + ": ";
      subject.appendChild(subjectLabel);
      subject.appendChild(document.createTextNode(language === "mr" ? book.subjectMr : book.subjectEn));
      medium.appendChild(mediumLabel);
      medium.appendChild(document.createTextNode(getTranslation(language, "marathi_medium")));
      link.className = "textbook-download";
      link.href = "https://ebooks.ebalbharati.in/pdfs/" + book.pdf + ".pdf";
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = getTranslation(language, "open_textbook");

      card.appendChild(cardTitle);
      card.appendChild(subject);
      card.appendChild(medium);
      card.appendChild(link);
      grid.appendChild(card);
    });
  }

  function initTextbookBrowser() {
    var selector = document.getElementById("class-selector-list");
    var grid = document.getElementById("textbook-grid");
    var selectedClass = 1;

    if (!selector || !grid || !window.textbookData) {
      return;
    }

    for (var classNumber = 1; classNumber <= 8; classNumber += 1) {
      var button = document.createElement("button");
      button.className = "class-button";
      button.type = "button";
      button.setAttribute("data-class", classNumber);
      button.textContent = translations.en["class_" + classNumber];

      button.addEventListener("click", function () {
        selectedClass = Number(this.getAttribute("data-class"));
        document.querySelectorAll(".class-button").forEach(function (item) {
          var active = Number(item.getAttribute("data-class")) === selectedClass;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });
        renderTextbooks(document.documentElement.lang || "en", selectedClass);
      });

      selector.appendChild(button);
    }

    window.updateTextbookLanguage = function (language) {
      selector.querySelectorAll(".class-button").forEach(function (button) {
        var number = button.getAttribute("data-class");
        button.textContent = getTranslation(language, "class_" + number);
      });
      renderTextbooks(language, selectedClass);
    };

    selector.querySelector(".class-button").click();
  }

  window.setLanguage = setLanguage;

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");

    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    document.querySelectorAll("[data-lang]").forEach(function (button) {
      button.addEventListener("click", function () {
        setLanguage(button.getAttribute("data-lang"));
      });
    });

    document.querySelectorAll("[data-language-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        setLanguage(document.documentElement.lang === "mr" ? "en" : "mr");
      });
    });

    initTextbookBrowser();
    setLanguage(readLanguage());
  });
})();

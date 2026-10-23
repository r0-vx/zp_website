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

    try {
      localStorage.setItem("language", language);
    } catch (error) {
      // Language preference is optional when storage is unavailable.
    }
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

    setLanguage(readLanguage());
  });
})();

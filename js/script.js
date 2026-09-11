document.addEventListener("DOMContentLoaded", function () {
  var b = document.querySelector(".nav-toggle"),
    n = document.querySelector(".nav-links");
  if (b && n)
    b.addEventListener("click", function () {
      var open = n.classList.toggle("open");
      b.setAttribute("aria-expanded", open ? "true" : "false");
    });
  var footer = document.querySelector(".footer");
  if (footer)
    footer.innerHTML = `<div class="footer-columns"><div><h2>Z.P. School Gokhiware</h2><p>Committed to accessible and meaningful education for every child.</p></div><div><h2>Quick Links</h2><ul class="footer-links"><li><a href="index.html">Home</a></li><li><a href="about.html">About Us</a></li><li><a href="academics.html">Academics</a></li><li><a href="activities.html">Activities</a></li><li><a href="gallery.html">Gallery</a></li><li><a href="notices.html">Notices</a></li><li><a href="contact.html">Contact</a></li></ul></div><div><h2>Connect With Us</h2><p>⌖ Z.P. School Gokhiware<br>Gokhivare Road,<br>Gokhivare Naka,<br>Golani Naka,<br>Vasai East,<br>Maharashtra – 401208</p><p>☎ +91 98765 43210<br>✉ school@example.com</p></div></div><div class="footer-bottom">© 2026 Z.P. School Gokhiware<br>Developed under Community Engagement Project — Fr. Conceicao Rodrigues College of Engineering</div>`;
  if (document.documentElement.lang === "mr" && footer)
    footer.innerHTML = footer.innerHTML
      .replaceAll("Z.P. School Gokhiware", "जिल्हा परिषद शाळा, गोखीवरे")
      .replaceAll(
        "Committed to accessible and meaningful education for every child.",
        "प्रत्येक विद्यार्थ्यास सुलभ व अर्थपूर्ण शिक्षण देण्यासाठी आम्ही कटिबद्ध आहोत.",
      )
      .replaceAll("Quick Links", "महत्त्वाचे दुवे")
      .replaceAll("Home", "मुख्यपृष्ठ")
      .replaceAll("About Us", "आमच्याबद्दल")
      .replaceAll("Academics", "शैक्षणिक माहिती")
      .replaceAll("Activities", "उपक्रम")
      .replaceAll("Gallery", "छायाचित्र दालन")
      .replaceAll("Notices", "सूचना")
      .replaceAll("Contact", "संपर्क")
      .replaceAll("Connect With Us", "आमच्याशी संपर्क साधा")
      .replaceAll("Gokhivare Road", "गोखीवरे रोड")
      .replaceAll("Gokhivare Naka", "गोखीवरे नाका")
      .replaceAll("Golani Naka", "गोलानी नाका")
      .replaceAll("Vasai East", "वसई पूर्व")
      .replaceAll("Maharashtra", "महाराष्ट्र")
      .replaceAll(
        "Developed under Community Engagement Project",
        "कम्युनिटी एंगेजमेंट प्रकल्पांतर्गत विकसित",
      );
  var main = document.querySelector("main");
  if (!main) return;
  var path = location.pathname.toLowerCase();
  var contact = `<section class="section visit-contact"><div><h2>Visit &amp; Contact Us</h2><iframe class="map-frame" title="Map showing Z.P. School Gokhiware" src="https://www.google.com/maps?q=19.4000038,72.8436215&amp;z=17&amp;output=embed" loading="lazy"></iframe><p><a class="button" href="https://maps.app.goo.gl/RkrtoRguzrPcqfsQ9" target="_blank" rel="noopener">Open in Google Maps</a></p></div><div class="contact-details"><h2>Visit &amp; Contact Us</h2><p><strong>Z.P. School Gokhiware</strong><br>Gokhivare Road,<br>Gokhivare Naka,<br>Golani Naka,<br>Vasai East,<br>Maharashtra – 401208</p><h3>Principal</h3><p><span class="placeholder">[Principal Name]</span><br>Principal, Z.P. School Gokhiware<br>☎ +91 98765 43210<br>✉ principal@example.com</p><h3>School Contact</h3><p><span class="placeholder">[Contact Person Name]</span><br>School Office<br>☎ +91 98765 43211<br>✉ school@example.com</p></div></section>`;
  if (path.endsWith("index.html") || path.endsWith("/")) {
    var old = main.querySelector("table");
    if (old) {
      var sec = old.closest(".section");
      sec.outerHTML =
        `<section class="section home-about"><div><h2>About Our School</h2><p>Zilla Parishad School Gokhiware is a government school serving students from the local community. The school provides education from Class 1 to Class 8 and focuses on accessible education, discipline, academic development and participation in school activities.</p><p>The school works towards creating a supportive learning environment for students while encouraging academic, cultural and community participation.</p><p class="muted"><span class="placeholder">Medium, student count, teacher count and school timings: To be updated</span></p></div><div class="school-photo" role="img" aria-label="School photo placeholder">SCHOOL PHOTO</div></section>` +
        contact;
      if (document.documentElement.lang === "mr")
        sec.outerHTML =
          `<section class="section home-about"><div><h2>आमच्या शाळेबद्दल</h2><p>जिल्हा परिषद शाळा, गोखीवरे ही स्थानिक परिसरातील विद्यार्थ्यांना शिक्षण देणारी शासकीय शाळा आहे. शाळेत इयत्ता १ ते इयत्ता ८ पर्यंत शिक्षण दिले जाते. विद्यार्थ्यांच्या शैक्षणिक प्रगतीसोबतच शिस्त, सर्वांगीण विकास आणि विविध शालेय उपक्रमांमध्ये सहभाग यावर भर दिला जातो.</p><p>विद्यार्थ्यांसाठी सकारात्मक आणि सहाय्यक शैक्षणिक वातावरण निर्माण करण्याबरोबरच शैक्षणिक, सांस्कृतिक आणि सामुदायिक उपक्रमांमध्ये सक्रिय सहभागासाठी त्यांना प्रोत्साहन दिले जाते.</p><p class="muted"><span class="placeholder">माध्यम, विद्यार्थी संख्या, शिक्षक संख्या आणि शाळेची वेळ: अद्ययावत करणे बाकी आहे</span></p></div><div class="school-photo" role="img" aria-label="शाळेचा फोटो">SCHOOL PHOTO</div></section>` +
          contact;
    }
  } else if (path.endsWith("contact.html")) {
    main.innerHTML = '<p class="breadcrumb">Home / Contact</p>' + contact;
  }
});

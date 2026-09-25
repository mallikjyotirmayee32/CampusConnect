document.addEventListener("DOMContentLoaded", function () {
  const role = sessionStorage.getItem("campusConnectRole");

  const nav = document.querySelector(".navbar nav");
  const loginButton = document.querySelector(".login-btn");

  if (!nav || !loginButton) {
    return;
  }

  /* ================================
       STUDENT NAVBAR
    ================================= */

  if (role === "student") {
    nav.innerHTML = `
            <a href="../index.html">HOME</a>
            <a href="companies.html">COMPANIES</a>
            <a href="drives.html">PLACEMENT DRIVES</a>
            <a href="my-applications.html">MY APPLICATIONS</a>
            <a href="contact.html">CONTACT</a>
        `;
  } else if (role === "admin") {

  /* ================================
       ADMIN NAVBAR
    ================================= */
    nav.innerHTML = `
            <a href="../index.html">HOME</a>
            <a href="companies.html">COMPANIES</a>
            <a href="students.html">STUDENTS</a>
            <a href="drives.html">PLACEMENT DRIVES</a>
            <a href="applications.html">APPLICATIONS</a>
            <a href="contact.html">CONTACT</a>
        `;
  }

  /* ================================
       LOGOUT
    ================================= */

  if (role === "student" || role === "admin") {
    loginButton.textContent = "LOGOUT";
    loginButton.href = "#";

    loginButton.onclick = function (event) {
      event.preventDefault();

      sessionStorage.removeItem("campusConnectStudent");
      sessionStorage.removeItem("campusConnectRole");

      window.location.href = "login.html";
    };
  }
});

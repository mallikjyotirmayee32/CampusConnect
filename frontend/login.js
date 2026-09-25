function selectRole(role) {
  const adminRole = document.getElementById("adminRole");
  const studentRole = document.getElementById("studentRole");
  const selectedRole = document.getElementById("selectedRole");

  if (!adminRole || !studentRole || !selectedRole) {
    return;
  }

  if (role === "admin") {
    adminRole.classList.add("active");
    studentRole.classList.remove("active");
    selectedRole.value = "admin";
  }

  if (role === "student") {
    studentRole.classList.add("active");
    adminRole.classList.remove("active");
    selectedRole.value = "student";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) {
    return;
  }

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const role = document.getElementById("selectedRole").value;

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
      alert("Please enter your Email ID and Password.");
      return;
    }

    /* =====================================================
       ADMIN LOGIN
    ===================================================== */

    if (role === "admin") {
      // Save login role
      sessionStorage.setItem("campusConnectRole", "admin");

      // Admin goes to Add Company
      window.location.href = "add-company.html";

      return;
    }

    /* =====================================================
       STUDENT LOGIN
    ===================================================== */

    if (role === "student") {
      try {
        const response = await fetch(
          "http://localhost:8080/api/students/email/" +
            encodeURIComponent(email),
        );

        if (!response.ok) {
          alert("Student account not found.");

          return;
        }

        const student = await response.json();

        if (!student) {
          alert("Student account not found.");

          return;
        }

        if (student.password !== password) {
          alert("Incorrect password.");

          return;
        }

        // Save student information
        sessionStorage.setItem("campusConnectStudent", JSON.stringify(student));

        // Save login role
        sessionStorage.setItem("campusConnectRole", "student");

        console.log(
          "Student session saved:",
          sessionStorage.getItem("campusConnectStudent"),
        );

        alert("Welcome " + student.fullName + "!");

        // Student goes to Placement Drives
        window.location.href = "drives.html";
      } catch (error) {
        console.error("Login error:", error);

        alert(
          "Unable to connect to CampusConnect backend.\n\n" +
            "Please make sure Spring Boot is running.",
        );
      }
    }
  });
});

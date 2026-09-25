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

    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
      alert("Please enter your Email ID and Password.");

      return;
    }

    /* ================= ADMIN LOGIN ================= */

    if (role === "admin") {
      sessionStorage.setItem("campusConnectRole", "admin");

      alert("Admin login successful!");

      window.location.href = "add-company.html";

      return;
    }

    /* ================= STUDENT LOGIN ================= */

    if (role === "student") {
      try {
        const response = await fetch(
          "https://campusconnect-dvn4.onrender.com/api/students/login",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              email: email,
              password: password,
            }),
          },
        );

        const responseText = await response.text();

        console.log("Login status:", response.status);

        console.log("Login response:", responseText);

        /* ================= SUCCESS ================= */

        if (response.ok) {
          let student;

          try {
            student = JSON.parse(responseText);
          } catch (error) {
            console.error("Invalid JSON:", error);

            alert("Login succeeded, but student data could not be read.");

            return;
          }

          sessionStorage.setItem(
            "campusConnectStudent",
            JSON.stringify(student),
          );

          sessionStorage.setItem("campusConnectRole", "student");

          alert("Welcome " + (student.fullName || "Student") + "!");

          window.location.href = "drives.html";

          return;
        }

        /* ================= STUDENT NOT FOUND ================= */

        if (response.status === 404) {
          alert(
            "Student account not found.\n\n" +
              "The email you entered is not registered.",
          );

          return;
        }

        /* ================= WRONG PASSWORD ================= */

        if (response.status === 401) {
          alert(
            "Incorrect password.\n\n" +
              "The email exists, but the password is incorrect.",
          );

          return;
        }

        /* ================= OTHER ERROR ================= */

        alert(
          "Login failed.\n\n" +
            "Status: " +
            response.status +
            "\n\n" +
            responseText,
        );
      } catch (error) {
        console.error("Student login error:", error);

        alert(
          "Unable to connect to CampusConnect backend.\n\n" +
            "Please try again.",
        );
      }
    }
  });
});

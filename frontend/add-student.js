/* =========================================================
              CAMPUSCONNECT - ADD STUDENT
              DATABASE CONNECTED VERSION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const studentForm = document.getElementById("studentForm");

  if (!studentForm) {
    return;
  }

  studentForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    /* ================= GET FORM VALUES ================= */

    const fullName = document.getElementById("fullName").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    const phone = document.getElementById("phone").value.trim();

    const rollNumber = document.getElementById("rollNumber").value.trim();

    const branch = document.getElementById("branch").value;

    const cgpa = document.getElementById("cgpa").value;

    const backlogs = document.getElementById("backlogs").value;

    const graduationYear = document.getElementById("graduationYear").value;

    /* ================= BASIC VALIDATION ================= */

    if (fullName === "") {
      alert("Please enter the student's full name.");
      return;
    }

    if (email === "") {
      alert("Please enter the student's email.");
      return;
    }

    if (password === "") {
      alert("Please enter a password.");
      return;
    }

    if (rollNumber === "") {
      alert("Please enter the roll number.");
      return;
    }

    if (branch === "") {
      alert("Please select the branch.");
      return;
    }

    if (cgpa === "") {
      alert("Please enter the CGPA.");
      return;
    }

    if (graduationYear === "") {
      alert("Please enter the graduation year.");
      return;
    }

    /* ================= CREATE STUDENT OBJECT ================= */

    const student = {
      fullName: fullName,

      email: email,

      password: password,

      phone: phone,

      rollNumber: rollNumber,

      branch: branch,

      cgpa: Number(cgpa),

      backlogs: backlogs === "" ? 0 : Number(backlogs),

      graduationYear: Number(graduationYear),
    };

    console.log("Student being sent:", student);

    /* ================= SEND TO BACKEND ================= */

    try {
      const response = await fetch("http://localhost:8080/api/students", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(student),
      });

      /* ================= SERVER ERROR ================= */

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Server Error:", errorText);

        alert(
          "Unable to register student.\n\n" +
            "Server returned: " +
            response.status,
        );

        return;
      }

      /* ================= SUCCESS ================= */

      const savedStudent = await response.json();

      console.log("Student saved successfully:", savedStudent);

      alert(fullName + " has been registered successfully!");

      /* ================= REDIRECT ================= */

      window.location.href = "students.html";
    } catch (error) {
      /* ================= CONNECTION ERROR ================= */

      console.error("Connection Error:", error);

      alert(
        "Unable to connect to CampusConnect server.\n\n" +
          "Please make sure the Spring Boot backend is running.",
      );
    }
  });
});

/* =========================================================
              CAMPUSCONNECT - ADD COMPANY
              DATABASE CONNECTED VERSION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const companyForm = document.getElementById("companyForm");

  if (!companyForm) {
    return;
  }

  companyForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    /* ================= GET FORM VALUES ================= */

    const companyName = document.getElementById("companyName").value.trim();
    const industry = document.getElementById("industry").value;
    const companyEmail = document.getElementById("companyEmail").value.trim();
    const contactPerson = document.getElementById("contactPerson").value.trim();
    const contactNumber = document.getElementById("contactNumber").value.trim();
    const website = document.getElementById("website").value.trim();

    const jobRole = document.getElementById("jobRole").value.trim();
    const packageAmount = document.getElementById("package").value.trim();

    const jobDescription = document
      .getElementById("jobDescription")
      .value.trim();

    const minCGPA = document.getElementById("minCGPA").value;
    const maxBacklogs = document.getElementById("maxBacklogs").value;

    const driveDate = document.getElementById("driveDate").value;
    const deadline = document.getElementById("deadline").value;

    const location = document.getElementById("location").value.trim();
    const driveType = document.getElementById("driveType").value;

    const selectionProcess = document
      .getElementById("selectionProcess")
      .value.trim();

    /* ================= GET SELECTED BRANCHES ================= */

    const branchCheckboxes = document.querySelectorAll(
      '.checkbox-grid input[type="checkbox"]:checked',
    );

    const eligibleBranches = [];

    branchCheckboxes.forEach(function (checkbox) {
      eligibleBranches.push(checkbox.value);
    });

    /* ================= BASIC VALIDATION ================= */

    if (companyName === "") {
      alert("Please enter the Company Name.");
      return;
    }

    if (jobRole === "") {
      alert("Please enter the Job Role.");
      return;
    }

    /* ================= CREATE COMPANY OBJECT ================= */

    const company = {
      companyName: companyName,
      industry: industry,
      companyEmail: companyEmail,
      contactPerson: contactPerson,
      contactNumber: contactNumber,
      website: website,

      jobRole: jobRole,
      packageAmount: packageAmount,
      jobDescription: jobDescription,

      minCGPA: minCGPA === "" ? null : Number(minCGPA),
      maxBacklogs: maxBacklogs === "" ? null : Number(maxBacklogs),

      eligibleBranches: eligibleBranches.join(", "),

      driveDate: driveDate,
      deadline: deadline,
      location: location,
      driveType: driveType,

      selectionProcess: selectionProcess,

      status: "Active Recruiter",
    };

    /* ================= SEND DATA TO SPRING BOOT ================= */

    try {
      const response = await fetch(
        "https://campusconnect-dvn4.onrender.com/api/companies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(company),
        },
      );

      /* ================= HANDLE SERVER ERROR ================= */

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Server Error:", errorText);

        alert("Unable to add company.\n\nServer returned: " + response.status);

        return;
      }

      /* ================= SUCCESS ================= */

      const savedCompany = await response.json();

      console.log("Company saved:", savedCompany);

      alert(companyName + " has been added successfully!");

      /* ================= GO TO COMPANIES PAGE ================= */

      window.location.href = "companies.html";
    } catch (error) {
      console.error("Connection Error:", error);

      alert(
        "Unable to connect to CampusConnect server.\n\n" +
          "Please make sure the Spring Boot backend is running.",
      );
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  loadMyApplications();
});

async function loadMyApplications() {
  const container = document.getElementById("applicationsContainer");

  if (!container) {
    return;
  }

  // =====================================================
  // GET LOGGED-IN STUDENT
  // =====================================================

  const studentData = sessionStorage.getItem("campusConnectStudent");

  if (!studentData) {
    container.innerHTML = `
      <div class="error-message">

        <h3>Student Login Required</h3>

        <p>
          Please login as a student to view your applications.
        </p>

      </div>
    `;

    return;
  }

  let student;

  try {
    student = JSON.parse(studentData);
  } catch (error) {
    console.error("Invalid student session:", error);

    sessionStorage.removeItem("campusConnectStudent");

    container.innerHTML = `
      <div class="error-message">

        <h3>Invalid Login Session</h3>

        <p>
          Please login again.
        </p>

      </div>
    `;

    return;
  }

  console.log("Logged-in student:", student);

  // =====================================================
  // GET ALL APPLICATIONS
  // =====================================================

  try {
    const response = await fetch("http://localhost:8080/api/applications");

    console.log("Applications API status:", response.status);

    if (!response.ok) {
      throw new Error("Backend returned status " + response.status);
    }

    const applications = await response.json();

    console.log("All applications:", applications);

    // ===================================================
    // FILTER CURRENT STUDENT
    // ===================================================

    const myApplications = applications.filter(function (application) {
      return (
        application.student &&
        Number(application.student.id) === Number(student.id)
      );
    });

    console.log("My applications:", myApplications);

    // ===================================================
    // NO APPLICATIONS
    // ===================================================

    if (myApplications.length === 0) {
      container.innerHTML = `
        <div class="empty-message">

          <h3>No Applications Found</h3>

          <p>
            You have not applied for any placement drive yet.
          </p>

        </div>
      `;

      return;
    }

    // ===================================================
    // DISPLAY APPLICATIONS
    // ===================================================

    container.innerHTML = "";

    myApplications.forEach(function (application) {
      const company = application.company || {};

      const status = application.status || "Applied";

      let statusClass = "status-applied";

      if (status === "Shortlisted") {
        statusClass = "status-shortlisted";
      }

      if (status === "Selected") {
        statusClass = "status-selected";
      }

      if (status === "Rejected") {
        statusClass = "status-rejected";
      }

      let applicationDate = "Not available";

      if (application.applicationDate) {
        const date = new Date(application.applicationDate);

        if (!isNaN(date.getTime())) {
          applicationDate = date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }
      }

      const card = document.createElement("div");

      card.className = "application-card";

      card.innerHTML = `

        <h2 class="company-name">
          ${company.companyName || "Company"}
        </h2>

        <p class="job-role">
          ${company.jobRole || "Job Role not specified"}
        </p>


        <div class="application-info">


          <div class="info-row">

            <span class="info-label">
              Industry
            </span>

            <span class="info-value">
              ${company.industry || "N/A"}
            </span>

          </div>


          <div class="info-row">

            <span class="info-label">
              Package
            </span>

            <span class="info-value">
              ${company.packageAmount || "N/A"}
            </span>

          </div>


          <div class="info-row">

            <span class="info-label">
              Drive Date
            </span>

            <span class="info-value">
              ${company.driveDate || "N/A"}
            </span>

          </div>


          <div class="info-row">

            <span class="info-label">
              Applied On
            </span>

            <span class="info-value">
              ${applicationDate}
            </span>

          </div>


        </div>


        <div>

          <span class="status ${statusClass}">
            ${status}
          </span>

        </div>

      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading my applications:", error);

    container.innerHTML = `
      <div class="error-message">

        <h3>
          Unable to Load Applications
        </h3>

        <p>
          Please make sure the CampusConnect backend is running.
        </p>

      </div>
    `;
  }
}
function logoutStudent() {
  sessionStorage.removeItem("campusConnectStudent");

  alert("You have been logged out successfully.");

  window.location.href = "login.html";
}

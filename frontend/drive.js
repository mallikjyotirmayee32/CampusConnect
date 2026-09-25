/* =========================================================
   CAMPUSCONNECT - PLACEMENT DRIVES
   DATABASE CONNECTED VERSION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  loadPlacementDrives();
});

/* =========================================================
                LOAD PLACEMENT DRIVES
========================================================= */

async function loadPlacementDrives() {
  const driveGrid = document.querySelector(".drive-grid");
  const driveCount = document.querySelector(".drive-count strong");
  const emptyDrive = document.querySelector(".empty-drive");

  if (!driveGrid) {
    return;
  }

  try {
    const response = await fetch(
      "https://campusconnect-dvn4.onrender.com/api/companies",
    );

    if (!response.ok) {
      throw new Error("Failed to load placement drives");
    }

    const companies = await response.json();

    /* ================= DRIVE COUNT ================= */

    if (driveCount) {
      driveCount.textContent = String(companies.length).padStart(2, "0");
    }

    /* ================= NO DRIVES ================= */

    if (companies.length === 0) {
      driveGrid.innerHTML = "";

      if (emptyDrive) {
        emptyDrive.style.display = "flex";
      }

      return;
    }

    if (emptyDrive) {
      emptyDrive.style.display = "none";
    }

    driveGrid.innerHTML = "";

    /* ================= CREATE DRIVE CARDS ================= */

    companies.forEach(function (company) {
      let formattedDate = "Not specified";

      if (company.driveDate) {
        const date = new Date(company.driveDate);

        if (!isNaN(date.getTime())) {
          formattedDate = date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        } else {
          formattedDate = company.driveDate;
        }
      }

      const branches =
        company.eligibleBranches && company.eligibleBranches.trim() !== ""
          ? company.eligibleBranches
          : "All branches";

      const firstLetter = company.companyName
        ? company.companyName.charAt(0).toUpperCase()
        : "C";

      const driveStatus = company.status
        ? company.status.toUpperCase()
        : "UPCOMING";

      const driveCard = document.createElement("div");

      driveCard.className = "drive-card";

      driveCard.innerHTML = `

        <div class="drive-top">

          <div class="drive-company-logo">
            ${firstLetter}
          </div>

          <div class="drive-company-info">

            <h3>
              ${company.companyName || "Company"}
            </h3>

            <p>
              ${company.industry || "Industry not specified"}
            </p>

          </div>

          <span class="drive-status upcoming">
            ${driveStatus}
          </span>

        </div>


        <p class="job-role">
          ${company.jobRole || "Job Role not specified"}
        </p>


        <div class="drive-details">

          <div>
            <span>📅</span>
            <p>
              <strong>${formattedDate}</strong>
              Drive Date
            </p>
          </div>


          <div>
            <span>💰</span>
            <p>
              <strong>
                ${company.packageAmount || "Not specified"}
              </strong>
              Package
            </p>
          </div>


          <div>
            <span>🎓</span>
            <p>
              <strong>
                ${
                  company.minCGPA !== null && company.minCGPA !== undefined
                    ? company.minCGPA
                    : "Not specified"
                }
              </strong>
              Minimum CGPA
            </p>
          </div>


          <div>
            <span>📍</span>
            <p>
              <strong>
                ${company.location || "Campus"}
              </strong>
              Location
            </p>
          </div>


          <div>
            <span>👥</span>
            <p>
              <strong>${branches}</strong>
              Eligible Branches
            </p>
          </div>


          <div>
            <span>🏢</span>
            <p>
              <strong>
                ${company.driveType || "Campus"}
              </strong>
              Drive Type
            </p>
          </div>

        </div>


        <div class="drive-footer">

          <span>
            Registration Open
          </span>

          <button
            type="button"
            onclick="applyForDrive(${company.id})"
          >
            APPLY NOW →
          </button>

        </div>

      `;

      driveGrid.appendChild(driveCard);
    });
  } catch (error) {
    console.error("Error loading placement drives:", error);

    driveGrid.innerHTML = `

      <div style="
        padding: 30px;
        text-align: center;
        width: 100%;
      ">

        <h3>
          Unable to load placement drives
        </h3>

        <p>
          Please make sure the CampusConnect backend
          is running.
        </p>

      </div>

    `;
  }
}

/* =========================================================
                    APPLY FOR DRIVE
========================================================= */

async function applyForDrive(companyId) {
  /* =========================================================
     GET LOGGED-IN STUDENT
  ========================================================= */

  const studentData = sessionStorage.getItem("campusConnectStudent");

  if (!studentData) {
    alert("Please login as a student before applying.");

    window.location.href = "login.html";

    return;
  }

  let student;

  try {
    student = JSON.parse(studentData);
  } catch (error) {
    console.error("Invalid student session:", error);

    sessionStorage.removeItem("campusConnectStudent");

    alert("Your login session is invalid. Please login again.");

    window.location.href = "login.html";

    return;
  }

  /* =========================================================
     SEND APPLICATION
  ========================================================= */

  try {
    const url =
      "https://campusconnect-dvn4.onrender.com/api/applications" +
      "?studentId=" +
      encodeURIComponent(student.id) +
      "&companyId=" +
      encodeURIComponent(companyId);

    console.log("Applying with:");
    console.log("Student ID:", student.id);
    console.log("Company ID:", companyId);
    console.log("URL:", url);

    const response = await fetch(url, {
      method: "POST",
    });

    /* =========================================================
       READ BACKEND RESPONSE
    ========================================================= */

    const responseText = await response.text();

    console.log("HTTP Status:", response.status);
    console.log("Backend Response:", responseText);

    /* ================= SUCCESS ================= */

    if (response.ok) {
      alert("Application submitted successfully!");

      return;
    }

    /* ================= ALREADY APPLIED ================= */

    if (response.status === 409) {
      alert("You have already applied for this placement drive.");

      return;
    }

    /* ================= OTHER BACKEND ERROR ================= */

    alert(
      "Application failed.\n\n" +
        "Status: " +
        response.status +
        "\n\n" +
        "Server response:\n" +
        responseText,
    );
  } catch (error) {
    console.error("Application error:", error);

    alert("Connection error.\n\n" + error.message);
  }
}

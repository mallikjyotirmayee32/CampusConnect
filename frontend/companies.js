/* =========================================================
            CAMPUSCONNECT - COMPANIES PAGE
            DATABASE CONNECTED VERSION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  loadCompanies();
});

/* =========================================================
                    LOAD COMPANIES
========================================================= */

async function loadCompanies() {
  const companyGrid = document.querySelector(".company-grid");
  const companyCount = document.querySelector(".company-count strong");
  const emptyCompany = document.querySelector(".empty-company");

  if (!companyGrid) {
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/companies");

    if (!response.ok) {
      throw new Error("Failed to load companies");
    }

    const companies = await response.json();

    /* ================= COMPANY COUNT ================= */

    if (companyCount) {
      companyCount.textContent = String(companies.length).padStart(2, "0");
    }

    /* ================= NO COMPANIES ================= */

    if (companies.length === 0) {
      companyGrid.innerHTML = "";

      if (emptyCompany) {
        emptyCompany.style.display = "flex";
      }

      return;
    }

    /* ================= COMPANIES AVAILABLE ================= */

    if (emptyCompany) {
      emptyCompany.style.display = "none";
    }

    companyGrid.innerHTML = "";

    /* ================= CREATE COMPANY CARDS ================= */

    companies.forEach(function (company) {
      const firstLetter = company.companyName
        ? company.companyName.charAt(0).toUpperCase()
        : "C";

      /* ================= BRANCHES ================= */

      const branches =
        company.eligibleBranches && company.eligibleBranches.trim() !== ""
          ? company.eligibleBranches
          : "All branches";

      /* ================= DRIVE DATE ================= */

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

      /* ================= CREATE CARD ================= */

      const companyCard = document.createElement("div");

      companyCard.className = "company-card";

      companyCard.innerHTML = `

        <div class="company-top">

          <div class="company-logo">
            ${firstLetter}
          </div>

          <div class="company-info">

            <h3>
              ${company.companyName || "Company"}
            </h3>

            <p>
              ${company.industry || "Industry not specified"}
            </p>

          </div>

          <span class="company-status">
            ${company.status || "Active Recruiter"}
          </span>

        </div>


        <div class="company-details">

          <div class="detail-item">

            <span class="detail-icon">💼</span>

            <div>
              <small>Job Role</small>

              <strong>
                ${company.jobRole || "Not specified"}
              </strong>
            </div>

          </div>


          <div class="detail-item">

            <span class="detail-icon">💰</span>

            <div>
              <small>Package</small>

              <strong>
                ${company.packageAmount || "Not specified"}
              </strong>
            </div>

          </div>


          <div class="detail-item">

            <span class="detail-icon">🎓</span>

            <div>
              <small>Minimum CGPA</small>

              <strong>
                ${
                  company.minCGPA !== null && company.minCGPA !== undefined
                    ? company.minCGPA
                    : "Not specified"
                }
              </strong>

            </div>

          </div>


          <div class="detail-item">

            <span class="detail-icon">👥</span>

            <div>
              <small>Eligible Branches</small>

              <strong>
                ${branches}
              </strong>
            </div>

          </div>


          <div class="detail-item">

            <span class="detail-icon">📅</span>

            <div>
              <small>Drive Date</small>

              <strong>
                ${formattedDate}
              </strong>
            </div>

          </div>


          <div class="detail-item">

            <span class="detail-icon">📍</span>

            <div>
              <small>Location</small>

              <strong>
                ${company.location || "Not specified"}
              </strong>
            </div>

          </div>

        </div>


        <div class="company-contact">

          <div>
            <span>HR / Contact</span>

            <strong>
              ${company.contactPerson || "Not specified"}
            </strong>
          </div>


          <div>
            <span>Email</span>

            <strong>
              ${company.companyEmail || "Not specified"}
            </strong>
          </div>


          <div>
            <span>Contact Number</span>

            <strong>
              ${company.contactNumber || "Not specified"}
            </strong>
          </div>

        </div>


        <div class="company-card-footer">

          <button
            type="button"
            class="delete-company-btn"
            onclick="deleteCompany(${company.id})"
          >
            DELETE
          </button>

          <span>
            ${company.driveType || "Placement Drive"}
          </span>

          <span class="company-arrow">
            VIEW DETAILS →
          </span>

        </div>

      `;

      companyGrid.appendChild(companyCard);
    });
  } catch (error) {
    console.error("Error loading companies:", error);

    companyGrid.innerHTML = `
      <div style="padding: 30px; text-align: center;">
        <h3>Unable to load companies</h3>
        <p>
          Please make sure the CampusConnect backend is running.
        </p>
      </div>
    `;
  }
}

/* =========================================================
                    DELETE COMPANY
========================================================= */

async function deleteCompany(companyId) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this company?",
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:8080/api/companies/" + companyId,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete company");
    }

    alert("Company deleted successfully.");

    loadCompanies();
  } catch (error) {
    console.error("Delete error:", error);

    alert("Unable to delete company. Please make sure the backend is running.");
  }
}

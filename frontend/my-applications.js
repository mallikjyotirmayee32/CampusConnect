/* =========================================================
   CAMPUSCONNECT - MY APPLICATIONS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  loadMyApplications();
});

async function loadMyApplications() {
  const container = document.getElementById("applicationContainer");

  const emptyApplications = document.getElementById("emptyApplications");

  const applicationCount = document.getElementById("applicationCount");

  /* ================= LOGIN CHECK ================= */

  const studentData = sessionStorage.getItem("campusConnectStudent");

  if (!studentData) {
    container.innerHTML = `
            <div class="login-required">

                <div class="login-required-icon">
                    🔐
                </div>

                <h3>
                    Student Login Required
                </h3>

                <p>
                    Please login as a student
                    to view your applications.
                </p>

                <a href="login.html">
                    LOGIN →
                </a>

            </div>
        `;

    return;
  }

  /* ================= READ STUDENT ================= */

  let student;

  try {
    student = JSON.parse(studentData);
  } catch (error) {
    console.error("Invalid student session:", error);

    sessionStorage.removeItem("campusConnectStudent");

    window.location.href = "login.html";

    return;
  }

  console.log("Logged-in student:", student);

  /* ================= GET APPLICATIONS ================= */

  try {
    const response = await fetch("http://localhost:8080/api/applications");

    if (!response.ok) {
      throw new Error("Server returned status: " + response.status);
    }

    const applications = await response.json();

    console.log("All applications:", applications);

    /* ================= FILTER ================= */

    const myApplications = applications.filter(function (application) {
      return application.student && application.student.id === student.id;
    });

    console.log("My applications:", myApplications);

    /* ================= COUNT ================= */

    applicationCount.textContent = String(myApplications.length).padStart(
      2,
      "0",
    );

    /* ================= EMPTY ================= */

    if (myApplications.length === 0) {
      container.style.display = "none";

      emptyApplications.style.display = "flex";

      return;
    }

    /* ================= SHOW APPLICATIONS ================= */

    emptyApplications.style.display = "none";

    container.style.display = "grid";

    container.innerHTML = "";

    /* ================= CREATE CARDS ================= */

    myApplications.forEach(function (application) {
      const company = application.company || {};

      /* APPLICATION DATE */

      let formattedDate = "Not specified";

      if (application.applicationDate) {
        const date = new Date(application.applicationDate);

        if (!isNaN(date.getTime())) {
          formattedDate = date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }
      }

      /* STATUS */

      const status = application.status || "Applied";

      /* COMPANY LETTER */

      const firstLetter = company.companyName
        ? company.companyName.charAt(0).toUpperCase()
        : "C";

      /* CREATE CARD */

      const card = document.createElement("div");

      card.className = "application-card";

      card.innerHTML = `

                    <div class="application-top">

                        <div class="company-letter">
                            ${firstLetter}
                        </div>


                        <div class="company-details">

                            <h3>
                                ${company.companyName || "Company"}
                            </h3>

                            <p>
                                ${company.industry || "Industry not specified"}
                            </p>

                        </div>


                        <span class="application-status">
                            ${status}
                        </span>

                    </div>


                    <div class="application-job">

                        <span>
                            JOB ROLE
                        </span>

                        <strong>
                            ${company.jobRole || "Not specified"}
                        </strong>

                    </div>


                    <div class="application-info">


                        <div>

                            <span>
                                💰
                            </span>

                            <p>

                                <strong>
                                    ${company.packageAmount || "Not specified"}
                                </strong>

                                Package

                            </p>

                        </div>


                        <div>

                            <span>
                                📅
                            </span>

                            <p>

                                <strong>
                                    ${formattedDate}
                                </strong>

                                Applied On

                            </p>

                        </div>


                        <div>

                            <span>
                                📍
                            </span>

                            <p>

                                <strong>
                                    ${company.location || "Campus"}
                                </strong>

                                Location

                            </p>

                        </div>


                    </div>


                    <div class="application-footer">

                        <span>
                            Application ID:
                            #${application.id}
                        </span>


                        <span>
                            Status:
                            <strong>
                                ${status}
                            </strong>
                        </span>

                    </div>

                `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Unable to load applications:", error);

    container.innerHTML = `

            <div class="application-error">

                <h3>
                    Unable to load applications
                </h3>

                <p>
                    Please make sure the
                    CampusConnect backend
                    is running.
                </p>

            </div>

        `;
  }
}

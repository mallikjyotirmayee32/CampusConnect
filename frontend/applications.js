document.addEventListener("DOMContentLoaded", function () {
  loadApplications();
});

async function loadApplications() {
  const tableBody = document.getElementById("applicationsTableBody");

  if (!tableBody) {
    console.error("applicationsTableBody not found");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/applications");

    console.log("Applications API status:", response.status);

    if (!response.ok) {
      throw new Error("Failed to load applications");
    }

    const applications = await response.json();

    console.log("Applications received:", applications);

    if (!applications || applications.length === 0) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="9"
                        style="text-align:center;">
                        
                        No student applications found.

                    </td>
                </tr>
            `;

      return;
    }

    tableBody.innerHTML = "";

    applications.forEach(function (application) {
      const student = application.student || {};

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

      const row = document.createElement("tr");

      row.innerHTML = `

                <td>
                    ${application.id || "N/A"}
                </td>


                <td>

                    <strong>
                        ${student.fullName || "N/A"}
                    </strong>

                    <br>

                    <small>
                        ${student.email || "N/A"}
                    </small>

                </td>


                <td>
                    ${student.rollNumber || "N/A"}
                </td>


                <td>
                    ${student.branch || "N/A"}
                </td>


                <td>

                    <strong>
                        ${company.companyName || "N/A"}
                    </strong>

                </td>


                <td>
                    ${company.jobRole || "N/A"}
                </td>


                <td>
                    ${student.cgpa ?? "N/A"}
                </td>


                <td>

                    <span class="status ${statusClass}">
                        ${status}
                    </span>

                </td>


                <td>

                    <button
                        class="action-btn shortlist-btn"
                        onclick="updateApplicationStatus(
                            ${application.id},
                            'Shortlisted'
                        )">

                        SHORTLIST

                    </button>


                    <button
                        class="action-btn select-btn"
                        onclick="updateApplicationStatus(
                            ${application.id},
                            'Selected'
                        )">

                        SELECT

                    </button>


                    <button
                        class="action-btn reject-btn"
                        onclick="updateApplicationStatus(
                            ${application.id},
                            'Rejected'
                        )">

                        REJECT

                    </button>

                </td>

            `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading applications:", error);

    tableBody.innerHTML = `

            <tr>

                <td colspan="9"
                    style="text-align:center;">

                    <h3>
                        Unable to load applications
                    </h3>

                    <p>
                        Please make sure the
                        CampusConnect backend
                        is running.
                    </p>

                </td>

            </tr>

        `;
  }
}

async function updateApplicationStatus(applicationId, newStatus) {
  const confirmed = confirm(
    "Are you sure you want to change the application status to " +
      newStatus +
      "?",
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:8080/api/applications/" +
        applicationId +
        "?status=" +
        encodeURIComponent(newStatus),
      {
        method: "PUT",
      },
    );

    const responseText = await response.text();

    if (!response.ok) {
      alert("Failed to update application.\n\n" + responseText);

      return;
    }

    alert("Application status updated to " + newStatus);

    loadApplications();
  } catch (error) {
    console.error("Status update error:", error);

    alert(
      "Unable to connect to the backend.\n\n" +
        "Please make sure Spring Boot is running.",
    );
  }
}

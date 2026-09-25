/* =========================================================
              CAMPUSCONNECT - STUDENT MANAGEMENT
              DATABASE CONNECTED VERSION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  loadStudents();
});

/* =========================================================
              LOAD ALL STUDENTS
========================================================= */

async function loadStudents() {
  const tableBody = document.getElementById("studentTableBody");
  const studentCount = document.getElementById("studentCount");

  try {
    const response = await fetch("http://localhost:8080/api/students");

    if (!response.ok) {
      throw new Error("Server returned status: " + response.status);
    }

    const students = await response.json();

    console.log("Students received:", students);

    /* ================= STUDENT COUNT ================= */

    studentCount.textContent = String(students.length).padStart(2, "0");

    /* ================= EMPTY STATE ================= */

    if (students.length === 0) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-message">
                        No students registered yet.
                    </td>
                </tr>
            `;

      return;
    }

    /* ================= DISPLAY STUDENTS ================= */

    tableBody.innerHTML = "";

    students.forEach(function (student) {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${student.id ?? "-"}</td>

                <td>${student.fullName ?? "-"}</td>

                <td>${student.email ?? "-"}</td>

                <td>${student.rollNumber ?? "-"}</td>

                <td>${student.branch ?? "-"}</td>

                <td>${student.cgpa ?? "-"}</td>

                <td>${student.backlogs ?? "0"}</td>

                <td>${student.graduationYear ?? "-"}</td>

                <td>
                    <button
                        class="delete-student-btn"
                        onclick="deleteStudent(${student.id})">
                        DELETE
                    </button>
                </td>
            `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Unable to load students:", error);

    tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="error-message">
                    Unable to connect to CampusConnect server.
                </td>
            </tr>
        `;
  }
}

/* =========================================================
              DELETE STUDENT
========================================================= */

async function deleteStudent(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this student?",
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/students/" + id, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Server returned status: " + response.status);
    }

    const message = await response.text();

    console.log("Delete response:", message);

    alert("Student deleted successfully!");

    /* Reload student list */

    loadStudents();
  } catch (error) {
    console.error("Unable to delete student:", error);

    alert(
      "Unable to delete student.\n\n" +
        "Please make sure the Spring Boot backend is running.",
    );
  }
}

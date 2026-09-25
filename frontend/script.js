document.addEventListener("DOMContentLoaded", function () {
  console.log("CampusConnect frontend loaded successfully.");

  // Backend connection test
  fetch("https://campusconnect-dvn4.onrender.com/api/test")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Backend returned status: " + response.status);
      }

      return response.text();
    })
    .then((data) => {
      console.log("Backend connected successfully!");
      console.log("Backend response:", data);
    })
    .catch((error) => {
      console.error("Backend connection failed:", error);
    });
});

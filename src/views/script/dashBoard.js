fetch("/api/statusCount")
  .then((response) => response.json())
  .then((apiResponse) => {
    // Extract the active and inactive counts from the API response
    const counts = apiResponse.data; // { active: 1, inactive: 0 }
    const activeCount = counts.active || 0;
    const inactiveCount = counts.inactive || 0;

    // Select the canvas for the chart
    const ctx = document.getElementById("activeInactiveChart").getContext("2d");
    new Chart(ctx, {
      type: "pie", // Ensure it's a pie chart
      data: {
        labels: ["Active", "Inactive"],
        datasets: [
          {
            data: [activeCount, inactiveCount], // Use the correct counts here
            backgroundColor: ["#2cbfea ", "#f44336"], // blue for active, red for inactive
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top", // Position the legend at the top
          },
        },
      },
    });
  })
  .catch((error) => console.error("Error fetching data:", error));

// 2 grpah

let feesChartInstance; // Global variable to hold the Fees Chart instance

// Event listener for the "Update Date" button
document.getElementById("updateDate").addEventListener("click", () => {
  const startDate = document.getElementById("startDate").value; // Get start date
  const endDate = document.getElementById("endDate").value; // Get end date

  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return; // Exit if dates are missing
  }

  // Fetch updated fees data based on selected dates
  fetch(`/api/feesSum?startDate=${startDate}&endDate=${endDate}`)
    .then((response) => response.json())
    .then((apiResponse) => {
      const { totalCollectedFees, totalUnpaidFees } = apiResponse.data;

      // Update the chart dynamically with new data
      updateFeesChart(totalCollectedFees, totalUnpaidFees);
    })
    .catch((error) =>
      console.error("Error fetching updated fees data:", error)
    );
});

// Function to initialize the Fees Chart (call this once on page load)
function createFeesChart() {
  const ctx = document.getElementById("feesChart").getContext("2d");

  // Create the chart instance and store it in the global variable
  feesChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Collected Fees", "Unpaid Fees"], // Chart labels
      datasets: [
        {
          label: "Fees Summary",
          data: [0, 0], // Initial placeholder data
          backgroundColor: ["#4caf50", "#f44336"], // Green and red
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
}

// Function to dynamically update the Fees Chart
function updateFeesChart(collectedFees, unpaidFees) {
  if (feesChartInstance) {
    feesChartInstance.data.datasets[0].data = [collectedFees, unpaidFees]; // Update chart data
    feesChartInstance.update(); // Redraw the chart
  } else {
    console.error("Fees chart instance not initialized!");
  }
}

// Initialize the Fees Chart on page load
createFeesChart();
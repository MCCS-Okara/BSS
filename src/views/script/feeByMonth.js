function showAlert(message) {
    const alertBox = document.getElementById("customAlert");
    document.getElementById("alertMessage").innerText = message;
    alertBox.classList.remove("hidden");
    alertBox.classList.add("flex");
}

function closeAlert() {
    const alertBox = document.getElementById("customAlert");
    alertBox.classList.add("hidden");
    alertBox.classList.remove("flex");
}

const tableBody = document.getElementById("tableBody");

document.getElementById("find").addEventListener("click", async () => {
    const months = document.getElementById("months").value;

    if (!months || months <= 0) {
        showAlert("Please enter a valid number of months.");
        return;
    }

    try {
        const response = await fetch("/api/feeByMonth", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ months }),
        });

        if (response.ok) {
            const { data } = await response.json();
            populateTable(data);
        } else {
            tableBody.innerHTML = "";
            const errorMessage = (await response.json()).message || "No Record Found";
            showAlert(errorMessage);
        }
    } catch (error) {
        console.error("Error:", error);
        showAlert("An error occurred while fetching data.");
    }
});

function populateTable(data) {
    tableBody.innerHTML = "";

    if (!data || data.length === 0) {
        showAlert("No data found for the selected criteria.");
        return;
    }

    data.forEach((student) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="border px-4 py-2 text-center">${student.registrationNo || "N/A"}</td>
            <td class="border px-4 py-2 text-center">${student.name || "N/A"}</td>
            <td class="border px-4 py-2 text-center font-bold text-red-500">${student.unpaidCount}</td>
            <td class="border px-4 py-2 text-center font-bold text-blue-500">${student.monthlyRemainingPayableCharges || "N/A"}</td>
        `;
        tableBody.appendChild(row);
    });
}

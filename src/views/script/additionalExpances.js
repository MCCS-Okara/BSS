function showAlert(message) {
  document.getElementById("alertMessage").innerText = message;
  document.getElementById("customAlert").style.display = "flex";
}

function closeAlert() {
  document.getElementById("customAlert").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Choices.js for multi-select dropdown
  const choices = new Choices("#class", {
    removeItemButton: true,
    placeholderValue: "Select Classes",
    searchEnabled: false,
    noChoicesText: "", // Removes the "No choices to choose" message
    itemSelectText: "", // Removes the "Press to select" message on hover
  });

  const additionalFieldsContainer = document.getElementById("additionalFieldsContainer");
  const addChargeFieldButton = document.getElementById("addChargeField");

  // Add dynamic charge fields
  addChargeFieldButton.addEventListener("click", (e) => {
    e.preventDefault();

    // Create a new div for the additional field
    const fieldDiv = document.createElement("div");
    fieldDiv.className = "flex items-center space-x-4 mt-4";

    // Create input for charge name
    const chargeName = document.createElement("input");
    chargeName.type = "text";
    chargeName.placeholder = "Charge Name";
    chargeName.className =
      "block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500";
    fieldDiv.appendChild(chargeName);

    // Create input for charge value
    const chargeValue = document.createElement("input");
    chargeValue.type = "number";
    chargeValue.placeholder = "Charge Value (Rs)";
    chargeValue.className =
      "block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500";
    fieldDiv.appendChild(chargeValue);

    // Create remove button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600";
    removeButton.addEventListener("click", () => {
      additionalFieldsContainer.removeChild(fieldDiv);
    });
    fieldDiv.appendChild(removeButton);

    // Add to container
    additionalFieldsContainer.appendChild(fieldDiv);
  });

  // Add event listener to "Submit Charges" button
  document.getElementById("submitCharges").addEventListener("click", async function () {
    const submitChargesButton = document.getElementById("submitCharges");

    // Disable the button to prevent multiple clicks
    submitChargesButton.disabled = true;
    submitChargesButton.innerText = "Submitting...";

    // Get Registration No value
    const registrationNo = document.getElementById("registrationNo").value.trim();
    // Get selected classes
    const selectedClasses = choices.getValue(true); // Returns an array of selected values
    const additionalCharges = [];

    // Collect all dynamic charge fields
    additionalFieldsContainer.querySelectorAll(".flex.items-center").forEach((fieldDiv) => {
      const chargeName = fieldDiv.querySelector("input[type=text]").value.trim();
      const chargeValue = parseFloat(fieldDiv.querySelector("input[type=number]").value.trim()) || 0;

      if (chargeName && chargeValue) {
        additionalCharges.push({ chargeName, chargeValue });
      }
    });

    // Validate that either Registration No or selected classes is provided
    if (!registrationNo && selectedClasses.length === 0) {
      showAlert("Please provide either registration number or class.");
      submitChargesButton.disabled = false;
      submitChargesButton.innerText = "Submit Charges";
      return;
    }

    // Ensure at least one charge field is filled
    if (additionalCharges.length === 0) {
      showAlert("Please add at least one charge with a valid name and value.");
      submitChargesButton.disabled = false;
      submitChargesButton.innerText = "Submit Charges";
      return;
    }

    try {
      const response = await fetch("/api/addCharges", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationNo,
          selectedClasses,
          additionalCharges,
        }),
      });
      console.log(additionalCharges)

      const data = await response.json();
      const message = data.message || (response.ok ? "Charges Added Successfully" : "Charges could not be added. Please try again.");

      if (response.ok) {
        // Clear input fields after successful submission
        document.getElementById("registrationNo").value = "";
        choices.clearStore(); // Clear selected classes
        additionalFieldsContainer.innerHTML = ""; // Clear dynamic fields
        showAlert(message);
      } else {
        showAlert(message);
      }
    } catch (error) {
      console.error("An Error Occurred", error);
      showAlert("An unexpected error occurred. Please try again later.");
    } finally {
      // Re-enable the button
      submitChargesButton.disabled = false;
      submitChargesButton.innerText = "Submit Charges";
    }
  });
});

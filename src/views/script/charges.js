let feeTableData = []; // Store fees to be submitted later
let student;
let paidFeeAmount;
// Show loading indicator
function showLoading() {
  const loadingElement = document.getElementById("loading");
  loadingElement.classList.remove("hidden");
  loadingElement.classList.add("flex");
 const btn1=document.getElementById("receiveFee")
 btn1.disabled=true;
 btn1.classList.add("opacity-50", "cursor-not-allowed");
 const btn2=document.getElementById("verify");
 btn2.disabled=true;
 btn2.classList.add("opacity-50", "cursor-not-allowed");
 
}
// hide loading indicator
function hideLoading() {
  const loadingElement = document.getElementById("loading");
  loadingElement.classList.remove("flex");
  loadingElement.classList.add("hidden");
  const btn1=document.getElementById("receiveFee")
  btn1.disabled=false;
  btn1.classList.remove("opacity-50", "cursor-not-allowed");
  const btn2=document.getElementById("verify");
  btn2.disabled=false;
  btn2.classList.remove("opacity-50", "cursor-not-allowed");
  
}
// Show Alert
function showAlert(message) {
  document.getElementById("alertMessage").innerText = message;
  document.getElementById("customAlert").style.display = "flex";
}

// Close Alert
function closeAlert() {
  document.getElementById("customAlert").style.display = "none";
}
function confirmAlert(registrationNo) {
  return new Promise((resolve) => {
    // Update the confirmation message
    document.getElementById("confirmAlertMessage").innerText = `Are you sure you want to delete the Record for ${registrationNo}?`;

    // Show the alert by adjusting classes
    const confirmAlertElement = document.getElementById("confirmAlert");
    confirmAlertElement.classList.remove("hidden");
    confirmAlertElement.classList.add("flex");

    // Confirm button listener
    const confirmButton = document.getElementById("confirm-delete-btn");
    const cancelButton = document.getElementById("confirm-cancel-btn");

    // Add one-time event listeners
    confirmButton.onclick = () => {
      confirmAlertElement.classList.add("hidden");
      confirmAlertElement.classList.remove("flex");
      resolve(true); // Resolve the promise with "true" for confirmation
    };

    cancelButton.onclick = () => {
      confirmAlertElement.classList.add("hidden");
      confirmAlertElement.classList.remove("flex");
      resolve(false); // Resolve the promise with "false" for cancellation
    };
  });
}
//confirm dlete alert 
async function confirmDelete(registrationNo) {
  const userConfirmed = await confirmAlert(registrationNo);
  if (userConfirmed) { 
    try {
      showLoading();
      const response = await fetch(`/api/fees/temp/${registrationNo}`, { method: "DELETE" });
      hideLoading();
      if (response.ok) {
        showAlert("Record deleted successfully!");
        document.getElementById(`row-${registrationNo}`).remove(); // Remove the row from the table
      } else {
        const error = await response.json();
        showAlert(error.message || "Failed to delete the record.");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      showAlert("An error occurred while deleting the record.");
    }
  }
}

// Handle form submission
document
  .getElementById("fee-payment-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const registrationNo = document.getElementById("registrationNo").value;
    // Get paid fee amount
     paidFeeAmount =parseFloat(document.getElementById("paidFeeAmount").value) || 0;
    // Validate Registration Number
    if (!registrationNo || paidFeeAmount <= 0) {
      showAlert("Please enter a Registration No.");
      return;
    }
    try {
      // Show loading indicator
      showLoading();
      // Fetch student data
      const studentResponse = await fetch(`/api/students/${registrationNo}`);
      const response = await studentResponse.json();

      // Hide loading indicator
      hideLoading();
      if (!studentResponse.ok) {
        showAlert(response.message || "Student data not found.");
        return;
      }

      student = response.data;
      if (student) {
        // Populate verification section
        document.getElementById("verifyRegistrationNo").innerText =
          student.registrationNo || "Not found";
        document.getElementById("verifyName").innerText =
          student.name || "Not found";
        document.getElementById("verifyFatherName").innerText =
          student.fatherName || "Not found";
        document.getElementById("verifyClassName").innerText =
          student.className || "Not found";
        document.getElementById("verifyStatus").innerText =
          student.status || "Not found";
        document.getElementById("verifyPendingFee").innerText =
          student.monthlyRemainingPayableCharges || "0";
          document.getElementById("verifypaidFeeAmount").innerText=paidFeeAmount;
      }
    } catch (error) {
      console.error("Request failed:", error);
      hideLoading();
      showAlert("An error occurred while fetching student data.");
    }
  });

document.getElementById("verify").addEventListener("click", () => {
    document.getElementById("verify").disabled=true;
  //save to the backend
  saveFeeToBackend({
    registrationNo: student.registrationNo,
    name: student.name,
    className: student.className,
    paidFeeAmount: paidFeeAmount,
  });
  addToFeeTable({
    registrationNo: student.registrationNo,
    name: student.name,
    className: student.className,
    paidFeeAmount: paidFeeAmount,
  });
  document.getElementById("verifyRegistrationNo").innerText ="";
document.getElementById("verifyName").innerText ="";
document.getElementById("verifyFatherName").innerText ="";
document.getElementById("verifyClassName").innerText ="";
document.getElementById("verifyStatus").innerText ="";
document.getElementById("verifyPendingFee").innerText ="";
document.getElementById("verifypaidFeeAmount").innerText ="";
});

// Save the fee record to backend
async function saveFeeToBackend(feeRecord) {
  if (!feeRecord.registrationNo || feeRecord.paidFeeAmount <= 0) {
    showAlert("Invalid fee data.");
    return;
  }
  try {
    const response = await fetch("/api/fees/temp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feeRecord),
    });
    if (!response.ok) {
      const error = await response.json();
      console.error("Error saving fee record:", error);
      showAlert(error.message || "Failed to save fee record.");
    }
  } catch (error) {
    console.error("Request failed:", error);
    showAlert("An error occurred while saving fee record.");
  }
  finally{
    document.getElementById("verify").disabled=false;
  }
}

// Load fees from backend on page load
window.onload = () => {
  loadFeesFromBackend();
};

async function loadFeesFromBackend() {
  try {
    const response = await fetch("/api/fees/temp");
    if (response.ok) {
      const records = await response.json();
      const feeRecords = records.data;
      feeRecords.forEach((record) => addToFeeTable(record)); // Populate table
    } else {
      console.error("Error loading fee records:", await response.text());
    }
  } catch (error) {
    console.error("Error loading fee records:", error);
  }
}

// Add student fee to the table
function addToFeeTable(studentFee) {
  if (!studentFee.registrationNo || studentFee.paidFeeAmount <= 0) {
    showAlert("Invalid fee amount or student data.");
    return;
  }

  // Render the fee table
  const feeTableBody = document.getElementById("feeTableBody");
  const row = `
        <tr id="row-${studentFee.registrationNo}" class="hover:bg-gray-100 transition-all duration-200">
            <td class="border border-gray-300 px-6 py-4 text-center">${studentFee.registrationNo}</td>
            <td class="border border-gray-300 px-6 py-4 text-center">${studentFee.name}</td>
            <td class="border border-gray-300 px-6 py-4 text-center">${studentFee.className}</td>
            <td class="border border-gray-300 px-6 py-4 text-center font-semibold text-green-600">${studentFee.paidFeeAmount}</td>
         <td class="border border-gray-300 px-6 py-4 text-center">
        <button class="delete-btn text-red-500 hover:text-red-700" onclick="confirmDelete('${studentFee.registrationNo}')">
            &#10060;${studentFee.registrationNo.split("-")[1]}
        </button>
    </td>
            </tr>
    `;
  feeTableBody.innerHTML += row;

  // Reset form
  document.getElementById("fee-payment-form").reset();
}

// submit and pay all fee paid reocords
document.getElementById("submitAllFees").addEventListener("click", async () => {
  try {
    document.getElementById("submitAllFees").disabled=true;
    showLoading();
    const response = await fetch("/api/fees/receiveFee", {
      method: "POST",
    });
    if (response.ok) {
        hideLoading();
        showAlert("Fees submitted successfully!");
        document.getElementById("feeTableBody").innerHTML=``;
    } else {
      const error = await response.json();
      showAlert(error.message || "Error submitting fees.");
    }
  } catch (error) {
    console.error("Error submitting fees:", error);
    showAlert("An error occurred while submitting fees.");
  }finally {
    document.getElementById("submitAllFees").disabled=false;
  }
});




//unreceive Fee
// document.getElementById('deleteFee').addEventListener('click', async function(event) {
//     event.preventDefault();
//     const form = document.getElementById('fee-payment-form');
//     const registrationNo = document.getElementById('registrationNo').value;
//     const paidFeeAmount=document.getElementById('paidFeeAmount').value;
//     const submitButton = this;

//     // Check if registration number is entered
//     if (!registrationNo) {
//         showAlert("Please enter a Registration No before unreceiving.");
//         return;
//     }
//     if (!paidFeeAmount) {
//         showAlert("Please enter a Fee Amount");
//         return;
//     }
//     // Disable the unreceive button and update text
//     submitButton.disabled = true;
//     submitButton.innerText = 'Processing...';

//     try {
//         const response = await fetch(`/api/deleteReceiveFee`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ registrationNo ,paidFeeAmount}),
//         });

//         const result =await response.json();
//         if (response.ok) {
//             showAlert(result.message);
//             form.reset();
//         } else {
//             showAlert(result.message || "An error occurred.");
//         }
//     } catch (error) {
//         console.error('Request failed:', error);
//         showAlert("An error occurred while updating the fee status.");
//     } finally {
//         // Restore the button state and text
//         submitButton.disabled = false;
//         submitButton.innerText = "Unreceive";
//     }
// });

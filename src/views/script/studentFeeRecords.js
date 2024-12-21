// Show alert message
function showAlert(message) {
    const alertMessageElement = document.getElementById('alertMessage');
    const alertContainer = document.getElementById('customAlert');

    if (alertMessageElement && alertContainer) {
        alertMessageElement.innerText = message;
        alertContainer.style.display = 'flex';
    } else {
        console.error("Alert elements not found in DOM.");
    }
}

// Close alert
function closeAlert() {
    const alertContainer = document.getElementById('customAlert');
    if (alertContainer) {
        alertContainer.style.display = 'none';
    } else {
        console.error("Alert container not found in DOM.");
    }
}
// Get query parameter value from URL
function getQueryParam(param) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param);
}

let totalPendingFee = 0;

// Fetch and display fee records
async function StudentFee(registrationNo) {
    // Clear previous data
    document.getElementById("advanceFeeHeading").hidden = true;
    document.getElementById("pendingFeeHeading").hidden = true;
    document.querySelector("#feeRecords tbody").innerHTML = '';
    document.getElementById("totalPendingFee").innerText = "0.00";
    totalPendingFee = 0;

    try {
        // Fetch student data
        const result = await fetch(`/api/students/${registrationNo}`);
        if (!result.ok) {
            showAlert("Student not found or invalid Registration Number");
            return;
        }

        const student = await result.json();

        // Handle advance fee
        if (student?.data?.paidFee && student.data.paidFee > 0) {
            document.getElementById("advanceFeeHeading").hidden = false;
            document.getElementById("advanceFee").innerText = student.data.paidFee;
        }

        // Handle fee records
        const feeRecords = student?.data?.feeRecords;
        if (!feeRecords || feeRecords.length === 0) {
            showAlert("No fee records found for this student.");
            return;
        }

        const feeTableBody = document.querySelector("#feeRecords tbody");

        // Populate fee records
        for (let i = feeRecords.length - 1; i >= 0; i--) {
            const Id = feeRecords[i];
            const feeResponse = await fetch(`/api/studentsFeeRecords/${Id}`);
            if (!feeResponse.ok) {
                console.warn(`Failed to fetch fee record for ID: ${Id}`);
                continue;
            }

            const feeJsonData = await feeResponse.json();
            const feeData = feeJsonData?.data;

            if (!feeData) {
                console.warn(`Invalid fee data for ID: ${Id}`);
                continue;
            }

            // Accumulate pending fees
            totalPendingFee += feeData.feeAmount - feeData.paidFeeAmount;

            // Create table row
            const row = `
                <tr>
                    <td class="border px-4 py-2 text-sm text-center">${feeData.month || "N/A"}</td>
                    <td class="border px-4 py-2 text-sm text-center">${feeData.year || "N/A"}</td>
                    <td class="border px-4 py-2 text-sm text-center">${(feeData.feeAmount || 0)}</td>
                    <td class="border px-4 py-2 text-sm text-center">${(feeData.paidFeeAmount || 0)}</td>
                    <td class="border px-4 py-2 text-sm text-center">${feeData.status || "N/A"}</td>
                    <td class="border px-4 py-2 text-sm text-center">
                        ${feeData.paymentDate ? new Date(feeData.paymentDate).toLocaleDateString('en-CA') : "N/A"}
                    </td>
                </tr>
            `;
            feeTableBody.insertAdjacentHTML('beforeend', row);
        }

        // Update pending fee
        if (student?.data?.fullyPaid === "Unpaid" || totalPendingFee >= 0) {
            document.getElementById("pendingFeeHeading").hidden = false;
            document.getElementById("totalPendingFee").innerText = totalPendingFee;
        }

    } catch (error) {
        console.error("Error Fetching Fee Records:", error);
        showAlert("Failed to load student fee records. Please try again.");
    }
}

// Automatically load fee records on DOMContentLoaded if a default registration number exists
document.addEventListener('DOMContentLoaded', function () {
    const registrationNo = getQueryParam("registrationNo");

    if (registrationNo) {
        // Pre-fill the input field with the registration number if needed
        const registrationInput = document.getElementById("registrationNo");
        if (registrationInput) {
            registrationInput.value = registrationNo;
        }
        // Automatically call StudentFee to load fee records
        StudentFee(registrationNo);
    }
});

document.getElementById("filter").addEventListener("click",()=>{
    const registrationNo=document.getElementById("registrationNo").value.trim();
    if(!registrationNo){
        showAlert("Please enter a valid registration number.");
        return;
    }
    StudentFee(registrationNo);
})
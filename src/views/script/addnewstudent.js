// Show alert message
function showAlert(message) {
    document.getElementById('alertMessage').innerText = message;
    document.getElementById('customAlert').style.display = 'flex';
}

// Close alert
function closeAlert() {
    document.getElementById('customAlert').style.display = 'none';
}
   
// Set the image preview
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.src = reader.result; // Set the Base64 string as the image source
        };
        reader.readAsDataURL(file);
    }
}

// Reset the image preview
function resetImagePreview() {
    const imagePreview = document.getElementById('imagePreview');
    const fileInput = document.getElementById('photo');
    imagePreview.src = '/profile.jpg'; // Clear the image preview
    fileInput.value = ''; // Clear the file input
}

// Dynamically add previous fee fields
let previousFeeIndex = 0;

function addPreviousFeeFields() {
    const container = document.getElementById('previousFeesContainer');

    const div = document.createElement('div');
    div.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-3', 'gap-4', 'mb-4');
    div.id = `previousFee_${previousFeeIndex}`;
    div.innerHTML = `
        <div>
            <label for="previousMonth_${previousFeeIndex}" class="block text-sm font-bold mb-2">Month</label>
            <select id="previousMonth_${previousFeeIndex}" name="previousFees[${previousFeeIndex}][month]" class="w-full border border-gray-300 rounded py-2 px-3" required>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
            </select>
        </div>
        <div>
            <label for="previousYear_${previousFeeIndex}" class="block text-sm font-bold mb-2">Year:</label>
            <input type="text" id="previousYear_${previousFeeIndex}" name="previousFees[${previousFeeIndex}][year]" class="w-full border border-gray-300 rounded py-2 px-3" placeholder="YYYY" required>
        </div>
        <div>
            <label for="previousAmount_${previousFeeIndex}" class="block text-sm font-bold mb-2">Amount:</label>
            <input type="number" id="previousAmount_${previousFeeIndex}" name="previousFees[${previousFeeIndex}][feeAmount]" class="w-full border border-gray-300 rounded py-2 px-3" placeholder="00" required step="100">
        </div>
    `;

    container.appendChild(div);
    previousFeeIndex++;
    if (previousFeeIndex > 0) {
        document.getElementById('deleteFeeBtn').style.display = 'inline-block';
    }
}

function removeLatestPreviousFeeField() {
    if (previousFeeIndex > 0) {
        previousFeeIndex--;
        const element = document.getElementById(`previousFee_${previousFeeIndex}`);
        if (element) {
            element.remove();
        }

        if (previousFeeIndex === 0) {
            document.getElementById('deleteFeeBtn').style.display = 'none';
        }
    }
}

// Handle form submission
document.getElementById('student-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(this);

    // Manually process previous fee fields
    const previousFees = [];
    for (let i = 0; i < previousFeeIndex; i++) {
        const month = formData.get(`previousFees[${i}][month]`);
        const year = formData.get(`previousFees[${i}][year]`);
        const feeAmount = formData.get(`previousFees[${i}][feeAmount]`);
        if (month && year && feeAmount) {
            previousFees.push({ month, year, feeAmount });
        }
    }
    console.log(previousFees)
    formData.append('previousFees', previousFees);

    const submitButton = document.getElementById('submitButton'); // Assume the submit button has this ID
    submitButton.disabled = true; // Disable the button
    submitButton.innerText = 'Processing...'; // Change text to "Processing..."

    try {
        const response = await fetch(this.action, {
            method: 'POST',
            body: formData,   
        });

        let result;
        try {
            result = await response.json();
        } catch (error) {
            showAlert("Server error. Please try again.")
            return;
        }

        if (!response.ok) {
            if (result.message && result.message.includes('Registration number already exists')) {
                showAlert('Registration number already exists! Please change it.');
            } else {
                showAlert("An error occurred. Please try again.")
            }
        } else {
            showAlert('Student added successfully!');
            this.reset(); // Reset the form
            previousFeeIndex = 0; // Reset the fee index
            document.getElementById('previousFeesContainer').innerHTML = ''; // Clear previous fee fields
            // resetImagePreview(); // Clear image preview             
        }
    } catch (error) {
        console.error('Request failed:', error);
       showAlert("Network error. Please check your connection.")
    } finally {
        submitButton.disabled = false; // Re-enable the button
        submitButton.innerText = 'Add Student'; // Reset button text
    } 
});

// Clear image preview on form reset
document.getElementById("student-form").addEventListener("reset", function () {
    resetImagePreview(); // Clear the image preview
});

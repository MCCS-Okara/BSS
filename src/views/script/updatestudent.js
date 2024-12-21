function showAlert(message) {
  document.getElementById('alertMessage').innerText = message;
  document.getElementById('customAlert').style.display = 'flex';
}

function closeAlert() {
  document.getElementById('customAlert').style.display = 'none';
}


// student record 
function getQueryParam(pram) {
  const searchParam = new URLSearchParams(window.location.search);
  return searchParam.get(pram);
}
//get the registration no form the url
const registrationNo = getQueryParam("registrationNo");
if (registrationNo) {
  StudentData();
}

// Fetches student data
async function fetchStudentData(registrationNo) {
  const response = await fetch(`/api/students/${registrationNo}`);
  if (!response.ok) throw new Error("Student not found");
  return await response.json();
}

// show  the student data in the form
async function StudentData() {
  try {
    const result = await fetchStudentData(registrationNo);
    const student = result.data;
    document.getElementById("registrationNo").value = student.registrationNo;
    document.getElementById("name").value = student.name;
    document.getElementById("fatherName").value = student.fatherName;
    document.getElementById("cnic").value = student.cnic;
    document.getElementById("contact1").value = student.contact1;
    document.getElementById("contact2").value = student.contact2;
    document.getElementById("className").value = student.className;
    document.getElementById("campusName").value = student.campusName;
    document.getElementById("dateOfAdmission").value = new Date(student.dateOfAdmission).toISOString().split('T')[0];
    document.getElementById("status").value = student.status;
    document.getElementById("admissionFee").value = student.admissionFee;
    document.getElementById("monthlyFee").value = student.monthlyFee;
    document.getElementById("summerTaskCharges").value = student.summerTaskCharges;
    document.getElementById("absentFeeCharges").value = student.absentFeeCharges;
    document.getElementById("otherCharges").value = student.otherCharges;
  } catch (error) {
    console.error("Error Fetching Data", error);
  }
}


//after update submit student data
function updateStudentRecord(registrationNo) {
  const form = document.getElementById("updateStudent");
  const url = `/api/updateStudents/${registrationNo}`;

  //gather the form data
  const formdata = new FormData(form);
  const formObject = Object.fromEntries(formdata.entries());
  // snd the put request with the form data
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formObject)
  })
    .then(response => {
      if (response.ok) {
        showAlert("Record updated succssfully")
      } else {
        throw new Error("Failed to update data")
      }
    })
    .catch(error=>{
    console.error("Error :", error);
    showAlert("Updation Failed")
  });
}


// call submit student update form
document.getElementById("submitButton"). addEventListener("click", function(e) {
  e.preventDefault(); // Prevent the default form submission
  updateStudentRecord(registrationNo);
  })
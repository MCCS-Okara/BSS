document.querySelector("#filter").addEventListener("click", filterRecords);
async function filterRecords() {
  const cnicFilter = document.getElementById("cnic").value.trim();
  const nameFilter = document.getElementById("name").value.trim().toLowerCase();
  const contactFilter = document.getElementById("contact").value.trim();
  const classFilter = document
    .getElementById("class")
    .value.trim()
    .toLowerCase();
  try {
    const response = await fetch("/api/students");
    const result = await response.json();
    const students = result.data;

    // Filter students based on the input criteria
    const filteredStudents = students.filter((student) => {
      const matchescnic =
        !cnicFilter || student.cnic?.toString().includes(cnicFilter);

      const matchesname =
        !nameFilter || student.name?.toLowerCase().includes(nameFilter);

      const matchescontact =
        !contactFilter ||
        student.contact1?.toString().includes(contactFilter) ||
        student.contact2?.toString().includes(contactFilter);

      const matchesClass =
        !classFilter ||
        student.className?.toLowerCase().includes(classFilter.toLowerCase());

      return matchescnic && matchesClass && matchesname && matchescontact;
    });

    // Display only the filtered students
    displayRecords(filteredStudents);
  } catch (error) {
    console.error("Error loading student records:", error.message);
  }
}

async function displayRecords(students) {
  try {
    const cardContainer = document.getElementById("forRecord");
    cardContainer.innerHTML = "";
    // Hide table headers if there is only one student to show in card layout
    if (students.length === 1) {
      const student = students[0];
      forOneRecord(student);
    } else {
      let activeStudents=0;
      let inActiveStudents=0;
      let totalStudents=0;
      cardContainer.className =
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-4";
      for (const student of students) {
        totalStudents+=1;
        if(student.status=="Active"){
          activeStudents+=1;
        }
        else{
          inActiveStudents+=1;
        }
        //  Create a card for each student
        const card = document.createElement("div");
        card.id = `${student.registrationNo}`;
        card.className =
          "bg-white shadow-lg rounded-lg p-6 space-y-4 hover:bg-gray-300";

        card.innerHTML = `
         <div class="flex items-center space-x-4">
           <div>
             <img 
               src="${student.photo ? `data:image/;base64,${student.photo}` : "/profile.jpg"}" 
               alt="Student Photo" 
               class="w-16 h-16 object-cover rounded-full border-4 border-gray-300"
             />
           </div>
           <div>
             <h3 class="text-lg font-bold text-gray-800">${student.name}</h3>
             <p class="text-sm text-gray-600">Class: ${student.className}</p>
             <p class="text-sm text-gray-600">Campus: ${student.campusName}</p>
           </div>
         </div>
         <div class="border-t pt-4 space-y-2 text-sm">
           <div class="flex justify-between">
             <span class="font-semibold text-gray-600">Registration No:</span>
             <span>${student.registrationNo}</span>
           </div>
           <div class="flex justify-between">
             <span class="font-semibold text-gray-600">Father's Name:</span>
             <span>${student.fatherName}</span>
           </div>
           <div class="flex justify-between"> 
             <span class="font-semibold text-gray-600">CNIC:</span>
             <span>${student.cnic || "N/A"}</span>
           </div>
           <div class="flex justify-between">
             <span class="font-semibold text-gray-600">Contact 1:</span>
             <span>${student.contact1 || "N/A"}</span>
           </div>
           <div class="flex justify-between">
             <span class="font-semibold text-gray-600">Contact 2:</span>
             <span>${student.contact2 || "N/A"}</span>
           </div>
           <div class="flex justify-between">
             <span class="font-semibold text-gray-600">Status:</span>
             <span class="${student.isPaid ? "text-green-600" : "text-red-600"}">
               ${student.isPaid ? "Fully Paid" : "Fee Pending"}
             </span>
           </div>
         </div>
         <div class="mt-4 flex justify-between space-x-2">
           <button
             onclick="window.location.href='/updatestudent?registrationNo=${student.registrationNo}'"
             class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md transition transform hover:scale-105"
           >
             Update Data
           </button>
           <button
             onclick="window.location.href='/studentFeeRecordsById?registrationNo=${student.registrationNo}'"
             class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-md transition transform hover:scale-105"
           >
             View Fee Records
           </button>
         </div>
       `;
        // Add a click listener to the card
        card.addEventListener("click", () => {
          forOneRecord(student); // Call function with the student object
        });
        // Append the card to the container
        cardContainer.appendChild(card);
      }
      document.getElementById("totalActiveInactiveStudents").hidden=false;
      document.getElementById("totalStudents").innerText=`Total Students:${totalStudents}`;
      document.getElementById("activeStudents").innerText=`Active Students:${activeStudents}`;
      document.getElementById("inactiveStudents").innerText=`Inactive Students:${inActiveStudents}`;
    }
  } catch (error) {
    console.error("Error loading student records:", error.message);
  }
}

// Sample function call to display records
const students = []; // Replace with actual data, e.g., [{ registrationNo: 1, name: "John Doe", ... }]
displayRecords(students);

//load record function
async function loadAllRecords() {
  try {
    const response = await fetch("/api/students");
    const result = await response.json();
    displayRecords(result.data);
  } catch (error) {
    console.error("Error loading all student records:", error.message);
  }
}
// Load all records on initial page load
document.addEventListener("DOMContentLoaded", loadAllRecords);

function forOneRecord(student) {
  document.getElementById("totalActiveInactiveStudents").hidden=true;
  const cardContainer = document.getElementById("forRecord");
  cardContainer.innerHTML = "";
  // Create card container

  cardContainer.className =
    "bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto space-y-4";

  // Add title
  cardContainer.innerHTML = `<div class="text-2xl font-bold text-gray-800 text-center mb-4">Student Information</div>`;

  // Define and display fields in a flex layout
  const fields = [
    { label: "Registration No :", value: student.registrationNo },
    { label: "Name :", value: student.name },
    { label: "Father's Name :", value: student.fatherName },
    { label: "CNIC :", value: student.cnic ?? "N/A" },
    { label: "Contact 1 :", value: student.contact1 ?? "N/A" },
    { label: "Contact 2 :", value: student.contact2 ?? "N/A" },
    { label: "Class Name :", value: student.className },
    { label: "Campus Name :", value: student.campusName },
    {
      label: "Date of Admission :",
      value: new Date(student.dateOfAdmission).toLocaleDateString(),
    },
    { label: "Status :", value: student.status },
    { label: "Per Month Fee :", value: student.monthlyFee },
    { label: "Remaining Admission Fee :", value: student.admissionFee },
    { label: "Summer Task Charges:", value: student.summerTaskCharges },
    { label: "Absent Charges:", value: student.absentFeeCharges },
    { label: "Other Charges :", value: student.otherCharges },
    {
      label: "Monthly Remaining Charges :",
      value: student.monthlyRemainingPayableCharges,
    },
    { label: "Fee Status :", value: student.fullyPaid },
    { label: "Advance Fee :", value: student.paidFee },
  ];
  if (student.photo) {
    // Example base64 image data (replace this with your actual data)
    const photoData = `data:image/;base64,${student.photo}`;
    // Add the image dynamically to the div
    cardContainer.innerHTML += `
         <div class="p-2 flex  justify-center ">
  <img src="${photoData}" alt="Student Photo" class="w-7 h-7 object-cover rounded-full border-4 border-gray-300">
</div>
        `;
  }
  fields.forEach((field) => {
    cardContainer.innerHTML += `
      <div class="flex justify-between  border-b pb-2 mb-2 text-gray-700">
        <span class="font-semibold text-gray-600">${field.label}</span>
        <span class="text-gray-800">${field.value}</span>
      </div>`;
  });

  // Add "Update Data" button
  cardContainer.innerHTML += `
    <div class="text-center mt-4">
      <button onclick="window.location.href='/updatestudent?registrationNo=${student.registrationNo}'"
        class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md transition transform duration-200 hover:scale-105">
        Update Data
      </button>
      <button onclick="window.location.href='/studentFeeRecordsById?registrationNo=${student.registrationNo}'"
        class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md transition transform duration-200 hover:scale-105">
       View Fee Records
      </button>
    </div>`;
}

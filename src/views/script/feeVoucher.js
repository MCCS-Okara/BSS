document.querySelector("#printFilter").addEventListener("click", filterRecords);
async function filterRecords() {
  const registrationNoFilter = document
    .getElementById("registrationNo")
    .value.trim();
  const classFilter = document
    .getElementById("class")
    .value.trim()
    .toLowerCase();

  try {
    // Disable print button and update text
    document.querySelector("#printFilter").disabled = true;
    document.querySelector("#printFilter").innerText = "Printing...";

    // Fetch student data from API
    const response = await fetch("/api/students");
    const result = await response.json();
    const students = result.data;

    // Filter students based on the input criteria
    const filteredStudents = students.filter((student) => {
      // Check if registration number matches
      const matchesRegistrationNo =
        !registrationNoFilter ||
        student.registrationNo?.toString().includes(registrationNoFilter);

      // Check if class matches (case-insensitive)
      const matchesClass =
        !classFilter || student.className?.toLowerCase().includes(classFilter);

      // Check if status is "Active"
      const matchesStatus = student.status?.includes("Active");

      // Check if fullyPaid status is "Unpaid"
      const matchesFeeStatus = student.fullyPaid?.includes("Unpaid");

      // Return true only if all conditions are met
      return (
        matchesRegistrationNo &&
        matchesClass &&
        matchesStatus &&
        matchesFeeStatus
      );
    });
    filterVouchers(filteredStudents);
  } catch (error) {
    document
      .querySelector("#printFilter")
      .addEventListener("click", filterRecords);
    document.querySelector("#printFilter").disabled = false;
    document.querySelector("#printFilter").innerText = "Search";
    console.error("Error fetching or filtering records:", error);
  }
}
async function feeData(record) {
  const feeResponse = await fetch(`/api/studentsFeeRecords/${record}`);
  const feejsonData = await feeResponse.json();
  const feeData = feejsonData.data;
  return feeData;
}
const today = new Date();
async function filterVouchers(filteredStudents) {
  try {
    const allVoucherContainer = document.getElementById("allVoucherContainer");
    allVoucherContainer.innerHTML = "";
    let count = 1;
    for (const student of filteredStudents) {
      const lastSixFeeRecordsId =
        student.feeRecords && Array.isArray(student.feeRecords)
          ? student.feeRecords.slice(-6)
          : [];
      // Fetch the data for the last six fee records
      const lastSixFeeRecords = await Promise.all(
        lastSixFeeRecordsId.map((record) => feeData(record))
      );
      const voucher = `<div class="px-2 mx-5 w-1/3 rounded-lg border bg-white p-2 shadow-lg gap-3">
<!-- Header Section -->
             <div class="flex items-center">
  <div class="mr-4">
    <img src="/BSS LOGO.png" class="w-10 h-10 object-contain" alt="BSS Logo">
  </div>
  <div class="mb-1 text-center">
    <h1 class="text-xs font-bold">BLOOMS SCHOOL SYSTEM</h1>
    <p class="text-xs">${student.campusName}</p>
    <p class="text-xs">${student.registrationNo}</p>
  </div>
  <div class="ml-4">
    <img src="data:image/;base64,${student.photo}" class="w-10 h-10 object-contain" alt="BSS Logo">
  </div>
</div>
 <!-- Voucher Info -->
            <div class="grid grid-cols-2 border-b border-t py-0.5">
                    <div><strong>Reg #:</strong>${student.registrationNo}</div>
                    <div><strong>Issue Date:</strong>${new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString()}</div>
                    <div><strong>Due Date:</strong> ${new Date(today.getFullYear(), today.getMonth(), 10).toLocaleDateString()}</div>
             </div>

<!-- Student Info -->
           <div class="my-1 grid grid-cols-2 text-xs">
                    <div class="whitespace-nowrap"><strong>Name:</strong>${student.name}</div>
                    <div class="whitespace-nowrap"><strong>S/D/O:</strong>${student.fatherName}</div>
                    <div><strong>Class:</strong>${student.className}</div>
                    <div><strong>DOA:</strong>${new Date(student.dateOfAdmission).toLocaleDateString()}</div>
          </div>

                <hr class="my-1 border-t border-gray-300" />

  <!-- Fee Details Table -->
        <div class="my-1">
           <h2 class="text-center font-semibold">Fee Voucher For The Month Of ${new Date().toLocaleString("en-us", { month: "short" })}</h2>
                <table class="w-full border text-xxs">
                    <thead>
                       <tr class="bg-gray-200">
                          <th class="border px-1 py-0.5 text-left">Sr#</th>
                            <th class="border px-1 py-0.5 text-left">Description</th>
                            <th class="border px-1 py-0.5 text-right">Amount</th>
                       </tr>
                    </thead>
                    <tbody>
<!-- Conditionally render Absent Fine row if absentFeeCharges > 0 -->
            ${
              student.absentFeeCharges > 0
                ? `
                 <tr>
               <td class="border px-1 py-0.5">1</td>
               <td class="border px-1 py-0.5">Absent Fine</td>
                 <td class="border px-1 py-0.5 text-right">${student.absentFeeCharges}</td>
                 </tr>
                `
                : ""
            }

<!-- Conditionally render Summer Task Charges row if summerTaskCharges > 0 -->
                    ${
                      student.summerTaskCharges > 0
                        ? `
                   <tr>
                   <td class="border px-1 py-0.5">${student.absentFeeCharges > 0 ? "2" : "1"}</td>
                     <td class="border px-1 py-0.5">Summer Task Charges</td>
                 <td class="border px-1 py-0.5 text-right">${student.summerTaskCharges}</td>
                   </tr>
                            `
                        : ""
                    }

<!-- Conditionally render Other Charges row if otherCharges > 0 -->
                                               ${
                                                 student.otherCharges > 0
                                                   ? `
                                    <tr>
                          <td class="border px-1 py-0.5">
                                    ${student.absentFeeCharges > 0 && student.summerTaskCharges > 0 ? "3" : student.absentFeeCharges > 0 || student.summerTaskCharges > 0 ? "2" : "1"}
                            </td>
                               <td class="border px-1 py-0.5">Other Charges</td>
                                          <td class="border px-1 py-0.5 text-right">${student.otherCharges}</td>
                          </tr>
                                    `
                                                   : ""
                                               }

<!-- Render Monthly Fee row with calculated position -->
<tr>
    <td class="border px-1 py-0.5">${
      (student.absentFeeCharges > 0 ? 1 : 0) +
      (student.summerTaskCharges > 0 ? 1 : 0) +
      (student.otherCharges > 0 ? 1 : 0) +
      1
    }</td>
    <td class="border px-1 py-0.5">Monthly Fee</td>
    <td class="border px-1 py-0.5 text-right">${student.monthlyRemainingPayableCharges}</td>
</tr>
            </tbody>
                    </table>
                    <div class="mt-1 text-right">
                        <p><strong>Total Amount:</strong>${student.otherCharges + student.absentFeeCharges + student.summerTaskCharges + Number(student.monthlyRemainingPayableCharges)}</p>
                        <p><strong>Amount After Due Date:</strong>${student.otherCharges + student.absentFeeCharges + student.summerTaskCharges + Number(student.monthlyRemainingPayableCharges)}</p>
                    </div>
                </div>
                
                <hr class="my-1 border-t border-gray-300" />

<!-- Fee History Table -->
                <div class="my-1">
                    <h2 class="text-center font-semibold">Student Fee History (Last 6 Months)</h2>
                    <table class="w-full border text-xxs">
                        <thead>
                            <tr class="bg-gray-200">
                                <th class="border px-1 py-0.5">Sr#</th>
                                <th class="border px-1 py-0.5">Month</th>
                                <th class="border px-1 py-0.5">Paid Amount</th>
                                <th class="border px-1 py-0.5">Balance</th>
                            </tr>
                        </thead>
                      <tbody>
                      
                      ${lastSixFeeRecords
                        .slice()
                        .reverse()
                        .map(
                          (record, index) =>
                            `                      
                        <tr>
                        <td class="border px-1 py-0.5 text-center">${index + 1}</td>
                        <td class="border px-1 py-0.5">${record.month}</td>
                        <td class="border px-1 py-0.5 text-right">${record.paidFeeAmount}</td>
                        <td class="border px-1 py-0.5 text-right">${record.feeAmount - record.paidFeeAmount}</td>
                        </tr>
                      `
                        )
                        .join("")}
                      </tbody>
                    </table>
                </div>
                
   <!-- Bank Information -->
                <div class="my-1 text-xs">
                    <h2 class="font-semibold">Bank Information</h2>
                    <p class="text-xs"><strong>Bank:</strong> THE BANK OF KHYBER Account# 014000000338007 | BANK ALFALAH Account# 0069001004073340</p>
                </div>

   <!-- Message Box -->
                <div class="my-1 border-b border-t py-0.5 text-xs">
                    <p><strong>Note:</strong> This voucher is for the months of ${new Date().toLocaleString("en-us", { month: "short" })}.Parents can pay on a monthly basis as per convenience.</p>
                </div>

                <!-- Footer -->
                <p class="text-center text-xs font-bold">Fee Voucher</p>
            </div>
`;
      const voucherHTML = `
<div id="voucher-container${count}" class="break-after-page flex gap-x-6 text-xxs border-b border-t py-1">
             ${voucher} ${voucher} ${voucher}
</div>
    `;
      allVoucherContainer.insertAdjacentHTML("beforeend", voucherHTML);
      count++;
    }
    count = 0;
    printVouchers();
  } catch (error) {
    document
      .querySelector("#printFilter")
      .addEventListener("click", filterRecords);
    document.querySelector("#printFilter").disabled = false;
    document.querySelector("#printFilter").innerText = "Search";
    console.log(error);
  }
}
function printVouchers() {
  // Select the voucher container
  const voucherContainer = document.querySelector("#allVoucherContainer");
  const printContent = voucherContainer.innerHTML;

  if (!printContent) {
    document
      .querySelector("#printFilter")
      .addEventListener("click", filterRecords);
    document.querySelector("#printFilter").disabled = false;
    document.querySelector("#printFilter").innerText = "Search";
    console.error("Voucher container not found.");
    return;
  }
  const originalContent = document.body.innerHTML;
  document.body.innerHTML = printContent;

  window.print();
  document.body.innerHTML = originalContent;

  document
    .querySelector("#printFilter")
    .addEventListener("click", filterRecords);
  document.querySelector("#printFilter").disabled = false;
  document.querySelector("#printFilter").innerText = "Search";
}

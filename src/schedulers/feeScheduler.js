// import cron from "node-cron";
// import Student from "../models/studentschema.js";
// import Fee from "../models/feeschema.js";

// // Cron job that runs on the 1st of every month at midnight
// cron.schedule('0 1 1 * *', async () => {
// cron.schedule('* * * * *', async () => {
// try {
//   console.log("Running monthly fee generation job...");

//   // Get all students
//   const students = await Student.find();
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const currentMonth = new Date().getMonth(); // 1-based month
//   const currentMonthName = months[currentMonth];
//   const currentYear = new Date().getFullYear();

//   for (const student of students) {
//     // Create a new fee record for the current month
//     const fee = new Fee({
//       studentid: student._id,
//       month: currentMonthName,
//       year: currentYear,
//       feeAmount: student.monthlyFee,
//       paidFeeAmount: 0, // No fee paid initially
//       paymentDate: null, // Payment date will be null
//       status: "Unpaid",
//     });

//     // logic for automatic fee payment
//     let advanceFeeAmount = student.paidFee;
//     if (advanceFeeAmount > 0) {
//       const amountNeeded = fee.feeAmount - fee.paidFeeAmount;
//       if (advanceFeeAmount >= amountNeeded) {
//         fee.paidFeeAmount = fee.feeAmount;
//         fee.status = "Paid";
//         advanceFeeAmount -= amountNeeded;
//         fee.paymentDate = Date.now();
//       } else {
//         fee.paidFeeAmount += advanceFeeAmount;
//         student.monthlyRemainingPayableCharges +=
//           fee.feeAmount - fee.paidFeeAmount;
//         advanceFeeAmount = 0;
//         student.fullyPaid="Unpaid";
//       }
//     } else {
//       student.monthlyRemainingPayableCharges += fee.feeAmount;
//       student.fullyPaid="Unpaid";
//     }
//     student.paidFee=advanceFeeAmount;
//     // Save the fee record
//     await fee.save();
//     // Update student's feeRecords
//     student.feeRecords.push(fee._id);
//     await student.save();
//   }
//   console.log("Monthly fee generation completed.");
// } catch (error) {
//   console.error("Error during fee generation:", error);
// }
// });

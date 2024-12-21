import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Student from "../models/studentschema.js";
import Fee from "../models/feeschema.js";
export const addAdditionalCharges = asyncHandler(async (req, res, next) => {
  const {
    registrationNo,
    selectedClasses,
    additionalCharges
  } = req.body;
  
  try {
    let updateQuery = {};

    // Determine the update criteria
    if (registrationNo) {
      updateQuery = { registrationNo };
    } else if (selectedClasses && selectedClasses.length) {
      updateQuery = { className: { $in: selectedClasses } };
    } else {
      return next(
        new ApiError(400, "Please provide either registration number or class.")
      );
    }
    const currentDate=new Date();
    const currentMonth=currentDate.getMonth()+1;
    const currentYear=currentDate.getFullYear();

    // Increment additional charges
    const students= await Student.find(updateQuery).populate("feeRecords");
    if(students.length==0){
      return next(new ApiError(404, "No Student found for the given Record"));
    }
    for(const student of students){
      const currentFeeRecord=student.feeRecords.find((fee)=>{
        const feeDate=new Date(fee.createdAt);
        return feeDate.getMonth()+1===currentMonth && feeDate.getFullYear()===currentYear;
      })
      if (currentFeeRecord) {
        console.log(additionalCharges)
        const updateOtherCharges={...currentFeeRecord.additionalCharges.toObject() || {}};
        for (const charge of additionalCharges) {
          const { chargeName, chargeValue } = charge;
        updateOtherCharges[chargeName]=(updateOtherCharges[chargeName]||0)+Number(chargeValue)
      }
      console.log(updateOtherCharges)
      const a=await Fee.findByIdAndUpdate(currentFeeRecord._id,{
        $set:{
          additionalCharges:updateOtherCharges
        },
        $inc:{
          totalFee:Object.values(additionalCharges).reduce((sum,value)=>sum+Number(value),0)
        },
      },
       {new:true},
      )
      console.log(a)
    }else{
      return next(new ApiError(404, `No fee record found for the current month and year for student ${student.name}.`));
    }
  }

    // {
    //   $inc: {
    //     absentFeeCharges: Number(absentFeeCharges),
    //     summerTaskCharges: Number(summerTaskCharges),
    //     otherCharges: Number(otherCharges),
    //   },
    // });

    // if (updateResult.modifiedCount === 0) {
    //   return next(new ApiError(404, "No matching records found to update."));
    // }

    // Apply deductions sequentially
    // const updateDeductionResults = await Student.updateMany(updateQuery, [
      // Stage 1: Deduct from admission fee
//       {
//         $set: {
//           tempPaidFee: {
//             $cond: {
//               if: { $gte: ["$paidFee", "$admissionFee"] },
//               then: { $subtract: ["$paidFee", "$admissionFee"] },
//               else: 0,
//             },
//           },
//           tempAdmissionFee: {
//             $cond: {
//               if: { $gte: ["$paidFee", "$admissionFee"] },
//               then: 0,
//               else: { $subtract: ["$admissionFee", "$paidFee"] },
//             },
//           },
//         },
//       },
//       // Stage 2: Deduct from summer task charges
//       {
//         $set: {
//           tempSummerTaskCharges: {
//             $cond: {
//               if: { $gte: ["$tempPaidFee", "$summerTaskCharges"] },
//               then: 0,
//               else: { $subtract: ["$summerTaskCharges", "$tempPaidFee"] },
//             },
//           },
//           tempPaidFee: {
//             $cond: {
//               if: { $gte: ["$tempPaidFee", "$summerTaskCharges"] },
//               then: { $subtract: ["$tempPaidFee", "$summerTaskCharges"] },
//               else: 0,
//             },
//           },
//         },
//       },
//       // Stage 3: Deduct from absent fee charges
//       {
//         $set: {
//           tempAbsentFeeCharges: {
//             $cond: {
//               if: { $gte: ["$tempPaidFee", "$absentFeeCharges"] },
//               then: 0,
//               else: { $subtract: ["$absentFeeCharges", "$tempPaidFee"] },
//             },
//           },
//           tempPaidFee: {
//             $cond: {
//               if: { $gte: ["$tempPaidFee", "$absentFeeCharges"] },
//               then: { $subtract: ["$tempPaidFee", "$absentFeeCharges"] },
//               else: 0,
//             },
//           },
//         },
//       },
//       // Stage 4: Deduct from other charges
//       {
//         $set: {
//           tempOtherCharges: {
//             $cond: {
//               if: { $gte: ["$tempPaidFee", "$otherCharges"] },
//               then: 0,
//               else: { $subtract: ["$otherCharges", "$tempPaidFee"] },
//             },
//           },
//           tempPaidFee: {
//             $cond: {
//               if: { $gte: ["$tempPaidFee", "$otherCharges"] },
//               then: { $subtract: ["$tempPaidFee", "$otherCharges"] },
//               else: 0,
//             },
//           },
//         },
//       },
//       // Stage 5: Finalize the updates
//       {
//         $set: {
//           admissionFee: "$tempAdmissionFee",
//           summerTaskCharges: "$tempSummerTaskCharges",
//           absentFeeCharges: "$tempAbsentFeeCharges",
//           otherCharges: "$tempOtherCharges",
//           paidFee: "$tempPaidFee",
//         },
//       },
//       {
//         $set: {
//           fullyPaid: {
//             $cond: {
//               if: {
//                 $and: [
//                   { $eq: ["$summerTaskCharges", 0] },
//                   { $eq: ["$absentFeeCharges", 0] },
//                   { $eq: ["$otherCharges", 0] }
//                 ]
//               },
//               then: "Paid",
//               else: "Unpaid"
//             },
//           },
//         },
//       },
//       // Stage 6: Remove temporary fields
//       {
//         $unset: [
//           "tempPaidFee",
//           "tempAdmissionFee",
//           "tempSummerTaskCharges",
//           "tempAbsentFeeCharges",
//           "tempOtherCharges",
//         ],
//       },
//     ]);

//     // Confirm success
    return res.status(200).json(
      new ApiResponse(
        200,
        "Additional charges and deductions updated successfully.",
        // {
        //   updatedRecords: updateResult.modifiedCount,
        //   deductionsApplied: updateDeductionResults.modifiedCount,
        // }
      )
    );
  } catch (error) {
    console.error("Error updating additional charges:", error);
    return next(new ApiError(500, "Failed to add additional charges."));
  }
});

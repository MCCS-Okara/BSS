import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Student from "../models/studentschema.js";
import Fee from "../models/feeschema.js";
import tempFeeCollection from "../models/tempfeeschema.js";
import dailyFeeSum from "../models/dailyfeesumschema.js";

export const receiveFee = asyncHandler(async (req, res, next) => {
  try {
    let feeRecords=await tempFeeCollection.find();
    for(const record of feeRecords)
 {
   //convert into number
    const feeAmount = Number(record.paidFeeAmount);
    if (isNaN(feeAmount)) {
      continue;
    }
    // find student
    const student = await Student.findOne({registrationNo:record.registrationNo});
    // // if no student exits
    if (!student) {
      return next(
        new ApiError(404, "No Student Found with that registration number")
      );
    }
    // update the Fee
    student.paidFee += feeAmount;
    // store paid fee in variable
    let remaningFeeAmount = student.paidFee;

    // Process charges like admission, summerTask, and absentFee
    const feeCategories = [
      { charge: "admissionFee", amount: student.admissionFee },
      { charge: "summerTaskCharges", amount: student.summerTaskCharges },
      { charge: "absentFeeCharges", amount: student.absentFeeCharges },
      { charge: "otherCharges", amount: student.otherCharges },
    ];

    for (let category of feeCategories) {
      if (category.amount > 0 && remaningFeeAmount > 0) {
        const amountNeeded = category.amount;
        if (remaningFeeAmount >= amountNeeded) {
          student[category.charge] = 0;
          remaningFeeAmount -= amountNeeded;
        } else {
          student[category.charge] -= remaningFeeAmount;
          remaningFeeAmount = 0;
        }
      }
    }
    
    // update fee status if fully paid
    if(student.admissionFee &&student.summerTaskCharges &&student.absentFeeCharges && student.otherCharges>0)
    {
      student.fullyPaid="Unpaid";
    }
    else{
      student.fullyPaid="Paid"
    }
    // find monthly unpaid feeses
    let unpaidFeeRecords = await Fee.find({
      studentid: student._id,
      status: "Unpaid",
    }).sort({ createdAt: 1 });

    // check if monthly upaid feeses are
    if (unpaidFeeRecords) {
      for (const feeRecord of unpaidFeeRecords) {
        if (remaningFeeAmount <= 0) {
          break;
        }
        const amountNeeded = feeRecord.feeAmount - feeRecord.paidFeeAmount;
        if (remaningFeeAmount >= amountNeeded) {
          feeRecord.paidFeeAmount = feeRecord.feeAmount;
          feeRecord.status = "Paid";
          remaningFeeAmount -= amountNeeded;
          feeRecord.paymentDate = Date.now();
          student.monthlyRemainingPayableCharges =
            student.monthlyRemainingPayableCharges - amountNeeded;
          student.fullyPaid = "Paid";
        } else {
          student.monthlyRemainingPayableCharges =
            student.monthlyRemainingPayableCharges - remaningFeeAmount;
          student.fullyPaid = "Unpaid";
          feeRecord.paidFeeAmount += remaningFeeAmount;
          remaningFeeAmount = 0;
        }
        await feeRecord.save();
      }
    }
    student.paidFee = remaningFeeAmount;
    await student.save();
    const formattedDate = new Date().toISOString().split("T")[0]; // Format to YYYY-MM-DD
    await dailyFeeSum.findOneAndUpdate(
      { paymentDate: formattedDate }, // Search condition
      { $inc: { totalFeeCollected: record.paidFeeAmount } }, // Increment total fees collected
      { upsert: true, new: true } // Create document if it doesn't exist and return the updated document
    );
    // Delete the record from tempFeeCollection after successful processing
    await tempFeeCollection.deleteOne({ _id: record._id });
    
      }    // Return success response using your ApiResponse utility
    return res 
      .status(201)
      .json(new ApiResponse(201, "Fee Recieved Successfully"));
  } catch (error) {
    console.error("Error updating fee:", error);
    // Catch any error and pass it to your error handler
    return next(new ApiError(500, "An error occurred while updating the fee"));
  }
});
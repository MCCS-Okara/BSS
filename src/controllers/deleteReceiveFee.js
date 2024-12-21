import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Student from "../models/studentschema.js";
import Fee from "../models/feeschema.js";

export const deleteReceiveFee = asyncHandler(async (req, res, next) => {
  const { registrationNo, paidFeeAmount } = req.body;

  try {
    // Convert paidFeeAmount to a number
    let feeAmount = Number(paidFeeAmount);
    if (isNaN(feeAmount)) {
      return next(new ApiError(400, "Invalid Fee Amount"));
    }

    // Find the student
    const student = await Student.findOne({ registrationNo });
    if (!student) {
      return next(
        new ApiError(404, "No Student Found with that registration number")
      );
    }

    // Deduct from paidFee first
    if (student.paidFee >= feeAmount) {
      student.paidFee -= feeAmount;
      feeAmount = 0; // All deducted from paidFee
    } else {
      feeAmount -= student.paidFee;
      student.paidFee = 0; // Remaining amount to deduct from fee records
    }

    // Deduct from fee records if amount is still remaining
    if (feeAmount > 0) {
      const paidFeeRecords = await Fee.find({
        studentid: student._id,
        status: "Paid",
      }).sort({ createdAt: -1 }); // latest first

      for (const feeRecord of paidFeeRecords) {
        if (feeAmount <= 0) break; // Stop if no more to deduct

        const amountAlreadyPaid = feeRecord.paidFeeAmount;
        const deduction = Math.min(amountAlreadyPaid, feeAmount);

        feeRecord.paidFeeAmount -= deduction;
        feeAmount -= deduction;

        // Update fee record status
        if (feeRecord.paidFeeAmount < feeRecord.feeAmount) {
          feeRecord.status = "Unpaid";
        }

        await feeRecord.save();
      }
      
    }
      student.otherCharges+=feeAmount;
      feeAmount=0;
    // Update fullyPaid status
    const unpaidCharges = student.admissionFee + student.summerTaskCharges + student.absentFeeCharges + student.otherCharges;
    const remainingUnpaidFees = await Fee.countDocuments({
      studentid: student._id,
      status: "Unpaid",
    });

    if (unpaidCharges > 0 || remainingUnpaidFees > 0) {
      student.fullyPaid = "Unpaid";
    } else {
      student.fullyPaid = "Paid";
    }

    // Save the updated student record
    await student.save();

    // Return success response
    return res
      .status(201)
      .json(new ApiResponse(201, student, "Fee Deducted Successfully"));
  } catch (error) {
    console.error("Error deducting fee:", error);
    return next(new ApiError(500, "An error occurred while deducting the fee"));
  }
});
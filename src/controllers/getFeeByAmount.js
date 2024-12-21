import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Student from "../models/studentschema.js";

export const getFeeByAmount = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;
console.log("HARIS")
  // Validate input
  if (!amount) {
    return next(new ApiError(400, "amount are required."));
  }

  try {
    // Query the database to find unpaid fees by amount
    const studentsWithUnpaidAmount = await Student.aggregate([
      {
        $match: {
          monthlyRemainingPayableCharges: { $gte: parseInt(amount) },
        },
      },
    ]);

    if (!studentsWithUnpaidAmount || studentsWithUnpaidAmount.length === 0) {
      return next(
        new ApiError(404, "No data found for the selected criteria.")
      );
    }
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          studentsWithUnpaidAmount,
          "Students fetched successfully."
        )
      );
  } catch (error) {
    console.error("Error fetching students by month:", error);
    next(new ApiError(500, "An error occurred while fetching students."));
  }
});

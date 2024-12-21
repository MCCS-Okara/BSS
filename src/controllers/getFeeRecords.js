import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Fee from "../models/feeschema.js";

export const getFeeRecords = asyncHandler(async (req, res, next) => {
  // Extract the record ID from the request parameters
  const recordID = req.params.Id;
  // Find the fee record by ID
  const feeRecord = await Fee.findById(recordID);
  
  // Check if the fee record exists
  if (!feeRecord) {
    return next(new ApiError(404, "Fee record not found"));
  }
  
  // Respond with the found fee record
  res.status(200).json(new ApiResponse(200, feeRecord, "Fee record fetched successfully"));
});

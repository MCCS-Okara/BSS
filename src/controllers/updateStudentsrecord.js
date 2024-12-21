import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Student from "../models/studentschema.js";
import Fee from "../models/feeschema.js";

export const updateStudent = asyncHandler(async (req, res, next) => {
  const { registrationNo } = req.params;
  const updateData = req.body;

  const updateStudent = await Student.findOneAndUpdate(
    { registrationNo },
    updateData,
    { new: true, runValidators: true }
  ); //returns the update student and runs validator
  if (!updateStudent) {
    return next(new ApiError(404, "Student not found"));
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, updateStudent, "Student record updated succefully")
    );
});

// Fee Updation for all records page

export const updateFeeRecord = asyncHandler(async (req, res, next) => {
  const { Id } = req.params;
  const updateData = req.body;
  const updateFeeRecord = await Fee.findOneAndUpdate({ _id: Id }, updateData, {
    new: true,
    runValidators: true,
  }); //returns the update student and runs validator
  if (!updateStudent) {
    return next(new ApiError(404, "Student not found"));
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, updateFeeRecord, "Student record updated succefully")
    );
});

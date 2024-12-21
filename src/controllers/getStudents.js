import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Student from "../models/studentschema.js";
// get student data
export const getStudents = asyncHandler(async (req, res, next) => {
  const students = await Student.find({});
  res
    .status(200)
    .json(new ApiResponse(200, students, "Students fetched successfully"));
});

// get student data for specific registrationNo for update

export const getSpecificStudent = asyncHandler(async (req, res, next) => {
  const registrationNo = req.params.registrationNo;
  
  const specificStudent = await Student.findOne({ registrationNo });
 
  
  if (!specificStudent) {
    return next(new ApiError(404, "Student not found"));
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, specificStudent, "student fetched successfully")
    );
});

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Student from "../models/studentschema.js";

export const statusCount = asyncHandler(async (req, res, next) => {
  try {
    const activeCount = await Student.countDocuments({ status: "Active" });
    const inactiveCount = await Student.countDocuments({ status: "Inactive" });
    let counts = {
      active: activeCount,
      inactive: inactiveCount,
    };
    return res
      .status(200)
      .json(new ApiResponse(200, counts, "Student count fetched successfully"));
  } catch (error) {
    return next(new ApiError(500, "An Error occured while fetching the count"));
  }
});

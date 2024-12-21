import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import studentPicture from "../models/pictureschema.js";

export const getStudentPhoto = asyncHandler(async (req, res, next) => {
  try {
    const { studentPhotoReference } = req.params;
    const photoDoc = await studentPicture.findOne({
      _id: studentPhotoReference,
    });
    if (!photoDoc) {
      return next(new ApiError(404, "Photo not found"));
    }
    const { photo } = photoDoc;
    return res
      .status(200)
      .json(new ApiResponse(200, "Photo retrieved successfully", { photo }));
  } catch (error) {
    return next(
      new ApiError(500, "An Error occured while accessing the photo")
    );
  }
});

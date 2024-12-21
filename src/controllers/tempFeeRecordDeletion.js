import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import tempFeeCollection from "../models/tempfeeschema.js";

export const deleteFeeRecordFromBackend=asyncHandler(async(req,res,next)=>{
    const registrationNo=req.params.registrationNo;

    try{
      
      const deleted = await tempFeeCollection.deleteOne({ registrationNo });

      if (deleted.deletedCount > 0) {
        // Record successfully deleted
        res.status(200).json(new ApiResponse(200, "Record deleted successfully."));
      } else {
        // Record not found
        res.status(404).json(new ApiResponse(404, "Record not found."));
      }
    } catch (error) {
      // Log the error and respond with 500
      console.error("Error deleting record:", error);
      return next(new ApiError(500, "Internal Server Error."));
    }
  });
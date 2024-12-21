import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import tempFeeCollection from "../models/tempfeeschema.js";

export const saveFeeToBackend=asyncHandler(async(req,res,next)=>{
    try{
        const feeRecords=req.body;
        //save feerecords to temprary database collection
      await tempFeeCollection.create(feeRecords);
        res.status(200).json(new ApiResponse(200,"temp fee Students records Added temprarily"));
    }
    catch(error){ 
        console.error("Database insertion error:", error);
        res.status(500).json(new ApiResponse(500,"Error occurred while adding the temporary students" ));
    }
})


export const loadFeesFromBackend=asyncHandler(async(req,res,next)=>{
    try{
    const feeRecords=await tempFeeCollection.find();
    res.status(200).json(new ApiResponse(200,feeRecords,"Temp fee records fetched succssfuly"))
    }
    catch(error){
        return next(new ApiError(500,"Error while getting the temp saved records"))
    }
})
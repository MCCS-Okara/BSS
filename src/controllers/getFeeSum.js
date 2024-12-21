import dailyFeeSum from "../models/dailyfeesumschema.js";
import Fee from "../models/feeschema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const getFeeSum = asyncHandler(async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return next(new ApiError(400, "Start date and end date are required"));
    }
    const matchStage = {
      paymentDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    // aggreration pipeline to summ the feeses
    const collectedFeesResult = await dailyFeeSum.aggregate([
      { $match: matchStage }, //match document with this date range
      {
        $group: {
          _id: null,
          totalFeeCollected: { $sum: "$totalFeeCollected" },
        },
      },
    ]);

    const totalCollectedFees =
      collectedFeesResult.length > 0
        ? collectedFeesResult[0].totalFeeCollected
        : 0;        
  const feeMatchStage = {
    dueDate: {
      $gte: new Date(startDate),
      $lte:new Date(endDate),
    }, 
  };
  console.log(feeMatchStage)
    const unpaidFeesResult = await Fee.aggregate([
      { $match: feeMatchStage }, //match document with this date range
      {
        $group: {
          _id: null,
          totalUnpaidFees: {
            $sum: {
              $subtract: [
                { $ifNull: ["$feeAmount", 0] },
                { $ifNull: ["$paidFeeAmount", 0] },
              ],
            },
          },
        },
      },
    ]);
    console.log(unpaidFeesResult)
    // format response
    const totalUnpaidFees =
    unpaidFeesResult.length > 0 ? unpaidFeesResult[0].totalUnpaidFees : 0;
    console.log("hhh",totalUnpaidFees)
    console.log(totalUnpaidFees)
  const data = {
    totalCollectedFees,
    totalUnpaidFees,
    };
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Fee Collection Fetched Successfully"));
  } catch (error) {
    return next(new ApiError(500, "Error fetching fee collection"));
  }
}); 

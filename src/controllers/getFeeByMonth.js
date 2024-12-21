import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Student from "../models/studentschema.js";
import Fee from "../models/feeschema.js";

export const getFeeByMonth = asyncHandler(async (req, res, next) => {
    const { months } = req.body;

    // Validate input
    if (!months) {
        return next(new ApiError(400, "Months are required."));
    }

    try {
        // Query the database to find unpaid fees by month
        const studentsWithUnpaidMonths = await Fee.aggregate([
            {
                $match: {
                    status: "Unpaid", // Match only unpaid fees
                },
            },
            {
                $group: {
                    _id: "$studentid", // Group by student ID
                    unpaidCount: { $sum: 1 }, // Count unpaid months
                },
            },
            {
                $match: {
                    unpaidCount: { $gte: parseInt(months) }, // Filter students by unpaid months
                },
            },
        ]);

        const studentIds = studentsWithUnpaidMonths.map((student) => student._id);

        if (!studentIds || studentIds.length === 0) {
            return next(new ApiError(404, "No data found for the selected criteria."));
        }

        const students = await Student.find({ _id: { $in: studentIds } });

        // Merge student data with unpaid counts
        const result = students.map((student) => {
            const unpaidInfo = studentsWithUnpaidMonths.find(
                (item) => item._id.toString() === student._id.toString()
            );
            return {
                ...student.toObject(),
                unpaidCount: unpaidInfo ? unpaidInfo.unpaidCount : 0,
            };
        });

        res.status(200).json(new ApiResponse(200, result, "Students fetched successfully."));
    } catch (error) {
        console.error("Error fetching students by month:", error);
        next(new ApiError(500, "An error occurred while fetching students."));
    }
});

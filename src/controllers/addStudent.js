import { asyncHandler } from "../utils/asyncHandler.js";
import Student from "../models/studentschema.js";
import Fee from "../models/feeschema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Add New Student
export const addNewStudent = asyncHandler(async (req, res, next) => {
  const {
    name,
    fatherName,
    cnic,
    contact1,
    contact2,
    className,
    campusName,
    dateOfAdmission,
    familyName,
    status,
    admissionFee,
    pendingFee,
    monthlyFee,
    previousFees,
    summerTaskCharges,
    absentFeeCharges,
    otherCharges,
    paidFee = 0,
    fullyPaid,
  } = req.body;
  // Validate required fields
  if (
    !name ||
    !fatherName ||
    !className ||
    !campusName ||
    !dateOfAdmission ||
    !monthlyFee
  ) {
    return next(new ApiError(400, "All required fields must be provided"));
  }

  try {
   
    // Step 1: Handle photo upload
    let photoBase64=null;
    if (req.file) {
      const photoBuffer = req.file.buffer;
       photoBase64 = photoBuffer.toString("base64");
    }
    // Step 2: Create a new student instance
    const student = new Student({
      name,
      fatherName,
      cnic,
      contact1,
      contact2,
      className,
      campusName,
      dateOfAdmission,
      familyName,
      status,
      admissionFee,
      pendingFee,
      monthlyFee,
      summerTaskCharges,
      absentFeeCharges,
      otherCharges,
      paidFee,
      fullyPaid,
      photo: photoBase64 ? photoBase64 : null // Link the photo ID to the student
    });
console.log(previousFees)
    // Save the student document
    await student.save();

    // Step 4: Handle previous fees, if provided
    if (previousFees && Array.isArray(previousFees) && previousFees.length > 0) {
      try {
        // Flatten and normalize data, skipping invalid entries
        const normalizedFees = previousFees.flatMap((fee) => {
          // Handle JSON strings
          if (typeof fee === "string") {
            try {
              const parsedFee = JSON.parse(fee); // Attempt to parse JSON string
              if (typeof parsedFee === "object" && parsedFee !== null) {
                return [parsedFee];
              }
            } catch (error) {
              // Skip invalid strings like "[object Object]"
              console.error("Skipping invalid string:", fee);
              return [];
            }
          }
          // Handle objects
          if (typeof fee === "object" && fee !== null) {
            return [fee]; // Include valid objects
          }
          console.error("Skipping invalid entry:", fee); // Log invalid entries
          return []; // Skip invalid entries
        });
    
        // Track already processed fees to avoid duplicates
        const processedKeys = new Set(); // Use a Set for unique tracking
        const feeDocs = [];
        let totalPendingFees = 0;
    
        for (const feeData of normalizedFees) {
          const { month, year, feeAmount } = feeData;
    
          if (!month || !year || !feeAmount) {
            return next(new ApiError(400, `Invalid fee data: ${JSON.stringify(feeData)}`));
          }
    
          const feeAmountNum = parseFloat(feeAmount);
          if (isNaN(feeAmountNum) || feeAmountNum <= 0) {
            return next(new ApiError(400, `Invalid fee amount in ${JSON.stringify(feeData)}`));
          }
    
          // Create a unique key for this fee record (e.g., "month-year-amount")
          const feeKey = `${month}-${year}-${feeAmountNum}`;
          if (processedKeys.has(feeKey)) {
            continue; // Skip duplicate record
          }
    
          // Mark this fee as processed
          processedKeys.add(feeKey);
    
          // Save fee record to the database
          const fee = new Fee({
            month,
            year,
            feeAmount: feeAmountNum,
            studentid: student._id,
          });
    
          await fee.save();
          feeDocs.push(fee._id);
          totalPendingFees += feeAmountNum;
        }
    
        // Update student record with fee details
        student.feeRecords = [...student.feeRecords, ...feeDocs];
        student.monthlyRemainingPayableCharges += totalPendingFees;
    
        await student.save();
        return next(new ApiResponse(200, "Previous fees processed successfully."));
      } catch (error) {
        console.error("Error processing previous fees:", error);
        return next(new ApiError(500, "Internal server error."));
      }
    }
    
    
    
    // Step 5: Respond with success
    res
      .status(201)
      .json(new ApiResponse(201, "Student added successfully", student));
  } catch (error) {
    console.error("the erro is",error);
    // General error handler
    return next(new ApiError(500, "Failed to add student"));
  }
});
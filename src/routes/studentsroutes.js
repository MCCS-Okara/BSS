import express from "express";
import { addNewStudent } from "../controllers/addStudent.js";
import { receiveFee } from "../controllers/receiveFee.js";
import { getStudents } from "../controllers/getStudents.js";
import { getSpecificStudent } from "../controllers/getStudents.js";
import { updateStudent } from "../controllers/updateStudentsrecord.js";
import { getFeeRecords } from "../controllers/getFeeRecords.js"; 
import { updateFeeRecord } from "../controllers/updateStudentsrecord.js";
import { addAdditionalCharges } from "../controllers/addAdditionalCharges.js";
import { deleteReceiveFee } from "../controllers/deleteReceiveFee.js";
import { statusCount } from "../controllers/statusCount.js";
import { getFeeSum } from "../controllers/getFeeSum.js";
import { getStudentPhoto } from "../controllers/getStudentPhoto.js";
import { saveFeeToBackend } from "../controllers/tempFeeRecordStorageAndRetrival.js";
import { loadFeesFromBackend } from "../controllers/tempFeeRecordStorageAndRetrival.js";
import { deleteFeeRecordFromBackend } from "../controllers/tempFeeRecordDeletion.js";
import { getFeeByMonth } from "../controllers/getFeeByMonth.js";
import { getFeeByAmount } from "../controllers/getFeeByAmount.js";
import multer from "multer";


const storage=multer.memoryStorage(); //save the file as buffer in memory
const upload=multer({storage});

// create router 
const router = express.Router();
 

// RESTful routes for student management
router.post("/students",upload.single('photo'), addNewStudent); // Add a new student
router.get("/students", getStudents); // Fetch all students
router.get("/students/:registrationNo", getSpecificStudent); //for specifc student
router.post("/students", receiveFee);

router.get("/studentsFeeRecords/:Id", getFeeRecords); // Fetch all student Fees record
router.put("/addCharges", addAdditionalCharges); ///add the charges
router.put("/deleteReceiveFee", deleteReceiveFee); ///add the charges

router.put("/updateStudents/:registrationNo", updateStudent); //update the student data
router.put("/updateFeeRecord/:Id", updateFeeRecord); //update the student Fee data

router.get("/statusCount", statusCount); //count the active inactive status of students
router.get("/feesSum", getFeeSum); //count fee collected
router.put("/feeByMonth",getFeeByMonth)
router.put("/feeByAmount",getFeeByAmount)


router.get("/photo/:studentPhotoReference",getStudentPhoto)   //get the photo of the student

router.post("/fees/temp",saveFeeToBackend)               //submit the fee temporarily
router.get("/fees/temp",loadFeesFromBackend)            //load the fee from the backend
router.post("/fees/receiveFee", receiveFee); //update the student Fee data
router.delete("/fees/temp/:registrationNo",deleteFeeRecordFromBackend);

export default router;
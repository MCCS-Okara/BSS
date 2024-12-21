import mongoose from "mongoose";
import Counter from "./counterschema.js";
const studentSchema = new mongoose.Schema(
  {
    registrationNo: {
      type: String,
      required: false,
      unique:true,
    },
    name: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    cnic: {
      type: String, 
    },
    contact1: {
      type: String,
    },
    contact2: {
      type: String,
    },
    className: {
      type: String,
      required: true,
    },
    campusName: {
      type: String,
      required: true,
    },
    dateOfAdmission: {
      type: Date,
      required: true,
    },
    status:{
      type:String,
      default:"Active",
    },
    admissionFee: {
      type: Number,
      default:0,
    },
    monthlyFee: {
      type: Number,
      required: true,
    },
    summerTaskCharges: {
      type: Number,
      default:0,
    },
    absentFeeCharges: {
      type: Number,
      default:0,
    },
    otherCharges:{
      type: Number,
      default:0,
    },
    paidFee: {
      type: Number,
      default:0,
    },
    monthlyRemainingPayableCharges: {
      type: Number,
      default: 0,
    },
    fullyPaid: {
      type: String,
      default:"Unpaid",
    },
    photo:{
    type:String,
    },
    familyName:{
      type:String,
    },
    feeRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fee" }],
  },
  { timestamps: true }
);


//pre save midleware to generate autoincreamenting registration number
studentSchema.pre("save", async function (next) {
  // Debugging to ensure middleware execution
  if (!this.registrationNo) {
      const currentYear = new Date().getFullYear();
      try {
          const counter = await Counter.findOneAndUpdate(
              { name: "studentRegNo" },
              { $inc: { seq: 1 } },
              { new: true, upsert: true }
          );

          // Check if the counter was fetched/created successfully
          if (!counter) {
              throw new Error("Counter not found or failed to initialize");
          }

          this.registrationNo = `S${currentYear}-${counter.seq.toString().padStart(4, "5000")}`;
      } catch (error) {
          console.error("Error in middleware while generating registration number:", error);
          return next(error);
      }
  } else {
      console.log("Registration number already exists, skipping generation");
  }
  next();
});


const Student = mongoose.model("Student", studentSchema);
export default Student; 
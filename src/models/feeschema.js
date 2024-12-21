import mongoose from "mongoose"; 
const feeSchema = new mongoose.Schema({
  studentid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  month: {
    type: String, 
    required: true,
    enum: [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ],  // Optional, if you want month validation
  },
  year:{
    type: Number,
    required: true,
  },
  feeAmount:{
    type: Number,
    default:0,
  }, 
  additionalCharges: {
    type: Map,
    of: Number, // Example: { "late_fee": 200, "maintenance_fee": 300 }
    default: {},
  },
  paidFeeAmount: {
    type: Number,
    default:0,
  },
  dueDate:{
    type:Date,
    default:new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  paymentDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['Paid', 'Unpaid'],
    default: 'Unpaid',  // Changed to Unpaid as default, adjust based on your logic
  },
}, { timestamps: true });  // Adding timestamps for record creation and update tracking

const Fee = mongoose.model('Fee', feeSchema);
export default Fee;
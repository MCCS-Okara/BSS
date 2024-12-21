import mongoose from "mongoose";
const dailyFeeSumSchema=new mongoose.Schema({
    totalFeeCollected:{
        type:Number,
        required: true,
    default: 0,
    },
    paymentDate:{
        type:Date,
        required: true,
        unique: true,
    },
})
const dailyFeeSum=mongoose.model('dailyFeeSum',dailyFeeSumSchema)
export default dailyFeeSum;
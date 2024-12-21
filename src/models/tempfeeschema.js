import mongoose from "mongoose";
const tempFeeSchema=new mongoose.Schema({
    registrationNo:String,
    name:String,
    className:String,
    paidFeeAmount:Number,
})
const  tempFeeCollection=mongoose.model('tempFeeCollection',tempFeeSchema);
export default tempFeeCollection;
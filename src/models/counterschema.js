import mongoose from "mongoose";
const counterSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    seq:{
        type:Number,
        default:5400
    },
}
)
const Counter= mongoose.model('Counter', counterSchema);
export default Counter;
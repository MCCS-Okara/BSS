import mongoose from "mongoose";
const studnetPictureSchema=new mongoose.Schema(
    {
        studentId : {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Student',
        },
        photo:{
            type:String,
        },
    },{ timestamps: true }
);

const studentPicture=mongoose.model("studentPicture",studnetPictureSchema)
export default studentPicture;
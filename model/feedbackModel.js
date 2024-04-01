import mongoose from "mongoose";

const feedbackSchema= new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
    message:{
        type:String,
        required:[true,"enter your message"]
    },
    date:{
        type:Date,
        default:Date.now
    }
});

const Feedback = mongoose.model("feedback", feedbackSchema);
export default Feedback;
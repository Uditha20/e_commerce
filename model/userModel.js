import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    username:{
        type:String,
        required:[true,"please enter your username"]
    },
    password:{
        type:String,
        required:[true,"please enter password"],
        minlength:8
    }
})


const User=mongoose.model('user',userSchema);
export default User;
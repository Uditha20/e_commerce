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
        minlength:8,
        // select:false
    },
    isActive: {
        type: Boolean,
        default: true,
        // select:false
      },
    role:{
        type:String,
        default:'user'
    }
})


const User=mongoose.model('user',userSchema);
export default User;
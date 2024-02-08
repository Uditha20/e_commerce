import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        require:[true]
    },
    username:{
        type:String,
        require:[true,"please enter your username"]
    },
    password:{
        type:String,
        require:[true,"please enter password"],
        minlength:8
    }
})


const User=mongoose.model('user',userSchema);
export default User;
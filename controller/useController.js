import user from "../model/userModel.js"
import bcrypt from 'bcryptjs'
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import jwt from 'jsonwebtoken'
const registerUser =asyncErrorHandler( async (req, res) => {
     
      const { name, username, password } = req.body;
      // console.log(username);
      // check validation
      if (!name) {
        return res.json({
          err: 1,
        });
      }
      if (!password || password.length < 8) {
        return res.json({
          err: 2,
        });
      }
      const exits = await user.findOne({ username });
      if (exits) {
        return res.json({
          err: 3,
        });
      }
      bcrypt.genSalt(10, function(err, salt) {
        if(err){
          return res.json({
            err:err.message
          })
        }
        bcrypt.hash(password, salt, async function(err, hash) {
          if(err){
            return res.json({
              err:err.message
            })
          }
            // Store hash in your password DB.
            const userCreate = await user.create({name,username,password:hash});
            res.status(201).json({message:"ok",userCreate})
        });
    });
      //create the user
  
  }
);


const loginUser=async(req,res)=>{
    try{  
      const {username, password } = req.body;
      const userFind =await user.findOne({username});
      if(!userFind){
        return res.json({
          err:"NO User Name"
        })
      }

      bcrypt.compare(password,userFind.password,function(err,result){
        if(err){
          return res.status(500).json({
            err:"internal server error"
          })
        }
        if(result){
          jwt.sign({username:userFind.username,id:userFind._id},process.env.JWT_SECRET,{},(err,token)=>{
            if(err)throw err;
            res.cookie('token',token).json(userFind)
          })
       
        }else{
          return res.status(401).json({msg:"invalid Credential"})
        }

      })

    }catch(err){
          console.log(err)
    }
}


  export{registerUser,loginUser};
import user from "../model/userModel.js"
import bcrypt from 'bcryptjs'

const registerUser = async (req, res) => {
    try {
      const { name, username, password } = req.body;
      // console.log(username);
      // check validation
      if (!name) {
        return res.json({
          err: "name is required",
        });
      }
      if (!password || password.length < 8) {
        return res.json({
          err: "password is required and should be least 8 character",
        });
      }
      const exits = await user.findOne({ username });
      if (exits) {
        return res.json({
          err: "user already exits",
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
            return res.json(userCreate);
        });
    });
      //create the user
    } catch (err) {
      console.log(err.message);
    }
  };


  export{registerUser};
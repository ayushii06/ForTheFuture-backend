const User =require('../models/userModel.js')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signUp = async(req,res)=>{
  let success=false;
  try{
      let user = await User.findOne({email:req.body.email});
      if(user){
          return res.status(400).json({success,error:"Email ALready exists"})
      }
      let username = await User.findOne({username:req.body.username});
      if(user){
          return res.status(400).json({success,error:"username ALready exists"})
      }

      const secPass = await bcrypt.hash(req.body.password,10);
      user=await User.create({
          name:req.body.name,
          username:req.body.username,
          email:req.body.email,
          age:req.body.age,
          password:secPass,

      })

      const data={
          user:{
              id:user.id
          }
      }

      success=true;
     
      res.json({success,"message":"user created successfully"});
  }catch(error){
      console.log(error)
      res.status(404).send(success,'Internal Server Error')
  }

}


exports.login = async (req,res)=>{
  try{
      const {email,password} = req.body;
      if(!email||!password){
          return res.status(500).json({
              success:false,
              message:'Fill details carefully',
          });
      }
      var user = await User.findOne({email:email});
      if(!user){
          return res.status(404).json({
              success:false,
              message:'User Not Found',
          });
      }
      const payload = {
          id:user._id,
          email:user.email,
      }
      if(await bcrypt.compare(password,user.password)){
          const token = jwt.sign(payload,process.env.JWT_SECRET,{
              expiresIn:"2h",
          });
          user = user.toObject();
          user.token = token;
          user.password = undefined;
          const options = {
              expiresIn: new Date(Date.now() + 3*24*60*60*1000),
              httpOnly:true,
          }
          res.status(200).json({
              success:true,
              token,
              user,
              message:'Logged in Successfully',
          });
      }
      else{
          return res.status(403).json({
              success:false,
              message:'Please login with correct credentials',
          })
      }
  }
  catch(error){
      return res.status(500).json({
          success:false,
          message:error.message,
      })
  }
}

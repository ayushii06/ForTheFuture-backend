const mongoose=require('mongoose');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
      type:String,
      required:true,

  },
    email:{
        type:String,
        required:true,
    },
   
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        default:"12",
    },
    blogs:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Blog"
  }],
}
);


//Export the model
module.exports= mongoose.model('User', userSchema);
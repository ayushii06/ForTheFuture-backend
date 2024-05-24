const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({

    body:{
        type: String,
        required: true,
    },
    user:{
        type:String,
        required:true,
    },
    like:{
        type:Number,
        default:'0'
        
    },
    comment:[{
        type:String,
    }]
    
})

//export
module.exports = mongoose.model("Blog", blogSchema)
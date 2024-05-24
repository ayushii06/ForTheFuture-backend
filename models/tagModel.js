const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({

    body:{
        type:String,
        req:true,
    },
    blogs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog"
    }]
    
})

//export
module.exports = mongoose.model("Tag", tagSchema)
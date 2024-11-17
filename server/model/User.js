const { default: mongoose } = require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    address:{
        type:String,
    },
    phone:{
        type:String,
    },
    image:{
        type:String
    },
    admin:{
        type:Boolean,
        default:false
    }
},
{timestamps:true}
)
module.exports=mongoose.model("user",userSchema)
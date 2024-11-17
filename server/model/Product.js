const { default: mongoose } = require("mongoose");

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    categoryId:{
        type:String,
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String
    },
    size:{
        type:[String]
    },
    image:{
        type:String
    },
    sub_image:{
        type:[String]
    }   
},
{timestamps:true}
)
module.exports=mongoose.model('product',productSchema)
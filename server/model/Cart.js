const { default: mongoose } = require("mongoose");

const cartSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    productId:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        default:1
    },
    totalAmount:{
        type:Number
    }
},
{timestamps:true}
)

module.exports=mongoose.model('cart',cartSchema)
const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema({
    userId:{
        type:String
    },
    product:[
        {
            productId:{
                type: String,
                ref: 'product'
            },
            quantity:Number
        }
    ],
    price:{
        type:Number
    },
    confimationStatus:{
        type:String,
        default:"Chưa xác nhận"
    },
    paymentStatus:{
        type:String,
        default:"Thanh toán khi nhận hàng"
    }
},
{timestamps:true})

module.exports=mongoose.model("order",orderSchema)
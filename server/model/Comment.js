const mongoose=require('mongoose')

const commentSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    productId:{
        type:String
    },
    star:{
        type:Number
    },
    description:{
        type:String
    },
    image:{
        type:[String]
    },
    video:{
        type:[String]
    }
},
{timestamps:true}
)
module.exports=mongoose.model('comment',commentSchema)
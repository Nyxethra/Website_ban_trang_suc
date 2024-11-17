const Order =require('../model/Order')
const Cart=require('../model/Cart')

exports.creatOrder=async(req,reply)=>{
    try {
        if(req.user){
            const newOrder=new Order({
                userId:req.user,
                product:req.body.product,
                price:req.body.price,
                confimationStatus:req.body.confimationStatus,
                paymentStatus:req.body.paymentStatus
            })
            const order=await newOrder.save()
            const cartItems=req.body.product.map(item=>item.productId)
            await Cart.deleteMany({userId:req.user,productId:{$in:cartItems}})
            reply.code(200).send(order)
        }else{
            reply.code(401).send("Authentication")    
        }
    } catch (err) {
        reply.code(500).send(err)
    }
}
exports.orderAll=async(req,reply)=>{
    try {
        if(req.admin){
            const order=await Order.find()
            reply.code(200).send(order)
        }else{
            reply.code(401).send("Authentication")    
        }
    } catch (err) {
        reply.code(500).send(err)
    }
}
exports.orderByUser=async(req,reply)=>{
    try {
        if(req.user){
            const order=await Order.find({userId:req.user})
            reply.code(200).send(order)
        }else{
            reply.code(401).send("Authentication")    
        }
    } catch (err) {
        reply.code(500).send(err)
    }
}
exports.deleteOrder=async(req,reply)=>{
    try {
        if(req.user){
            const order=await Order.findByIdAndDelete(req.params.id)
            reply.code(200).send('delete success')
        }else{
            reply.code(401).send("Authentication")    
        }
    } catch (err) {
        reply.code(500).send(err)
    }
}
exports.UpdateOrder=async(req,reply)=>{
    try {
        if(req.admin){
            const order=await Order.findByIdAndUpdate({_id:req.params.id},{$set:req.body},{new:true})
            reply.code(200).send('update success')
        }else{
            reply.code(403).send("Forbiden")    
        }
    } catch (err) {
        reply.code(500).send(err)
    }
}
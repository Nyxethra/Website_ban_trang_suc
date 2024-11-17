const { promises } = require('fs')
const Cart =require('../model/Cart')
const Product=require('../model/Product')

exports.create=async(req,reply)=>{
    try {
        const newCart=new Cart({
            userId:req.user,
            productId:req.body.productId,
            quantity:req.body.quantity,
            totalAmount:req.body.totalAmount
        })
        const cart=await newCart.save()
        reply.code(200).send(cart)
    } catch (err) {
        reply.code(500).send(err)
    }
}

exports.update=async(req,reply)=>{
    try {
        const cart=await Cart.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        reply.code(200).send(cart)
    } catch (err) {
        reply.code(500).send(err)
    }
}
exports.delete=async(req,reply)=>{
    try {
        const cart=await Cart.findByIdAndDelete(req.params.id,{new:true})
        reply.code(200).send("Delete success")
    } catch (err) {
        reply.code(500).send(err)
    }
}

exports.cartByUser=async(req,reply)=>{
    try {
        const cart=await Cart.find({userId:req.user})
        const data=[]
        for(item of cart){
            const product=await Product.find({_id:item.productId})
            data.push({quantity:item.quantity,cartId:item._id,totalAmount:item.totalAmount,product})
        }
        const result=await Cart.aggregate([
            {
                $match:{userId:req.user}
            },
            {
                $group:{
                    _id:'$userId',
                    count:{$sum:1},
                    totalAmount: { $sum: '$totalAmount' } 
                }
            }
        ])
        const count= result.length>0 ?result[0].count : 0;
        const totalAmount= result.length>0 ?result[0].totalAmount : 0;
        reply.code(200).send({data,count,totalAmount})
    } catch (err) {
        reply.code(500).send(err)
    }
}
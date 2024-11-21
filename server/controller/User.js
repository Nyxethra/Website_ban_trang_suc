const User=require('../model/User')
const bcrypt=require('bcrypt')
const path=require('path')

exports.updateUser=async(req,reply)=>{
    try {
        if(req.body.password){
            req.body.password=await bcrypt.hash(req.body.password,10)
        }
        const newUser=await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        reply.code(200).send(newUser)
    
    } catch (err) {
        reply.code(500).send(err)
    }
}

exports.findUser=async(req,reply)=>{
    try {
        const user=await User.find()
        reply.code(200).send(user)

    } catch (err) {
        reply.code(500).send(err)
    }
}

exports.deleteUser=async(req,reply)=>{
    try {
        await User.findByIdAndDelete(req.params.id,{new:true})
        reply.code(200).send("Delete user successfully")
    } catch (err) {
        reply.code(401).send("You are not authenticate")
    }
}

exports.updatePass=async(req,reply)=>{
    try {
        const user=await User.findById(req.params.id)
        
        const isPassword=await bcrypt.compare(req.body.oldPassword,user.password)
        if(!isPassword) return reply.code(400).send("Wrong old password")
        if(req.body.newPassword1 !== req.body.password) return reply.code(400).send("Password don't match")
        req.body.password=await bcrypt.hash(req.body.password,10)
        const newUser=await User.findByIdAndUpdate(req.params.id,{password:req.body.password},{new:true})
        reply.code(200).send(newUser)
    } catch (err) {
        reply.code(500).send(err)
        
    }
}

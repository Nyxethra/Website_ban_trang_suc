const User=require('../model/User')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

exports.register=async(req,reply)=>{
    try {
        const user=await User.findOne({email:req.body.email})
        if(user) return reply.code(400).send("Email already exists")
        const hashPassword=await bcrypt.hash(req.body.password,10)
        const newUser=new User({
            name:req.body.name,
            email:req.body.email,
            password:hashPassword
        })
        const result=await newUser.save()
        reply.code(200).send(result)
    } catch (err) {
         reply.code(500).send(err)
    }
}
exports.signin=async(req,reply)=>{
    try {
        const user=await User.findOne({email:req.body.email})
        if(!user) return reply.code(404).send("Not found email")
        const isPassword=await bcrypt.compare(req.body.password,user.password)
        if(!isPassword) return reply.code(400).send("Wrong password")

        const token=jwt.sign({id:user._id,admin:user.admin},process.env.SECRET)
        reply
        .setCookie("accessCookie",token, {path:'/',httpOnly:true})
        .code(200)
        .send(user)
    } catch (err) {
         reply.code(500).send(err)
    }
}
exports.logout=async(req,reply)=>{
    reply.clearCookie('accessCookie',{path:'/'}).send('Logout successfully')
}

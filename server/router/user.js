const User=require('../model/User')
const authController=require('../controller/Auth')
const userController=require('../controller/User')
const fastifyPassport=require('@fastify/passport')
const CLIENT_URL="http://localhost:3000"
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')



async function userRouter(fastify,_,done){
    fastify.post('/user/register',authController.register)
    fastify.post('/user/signin',authController.signin)
    fastify.put('/user/update/:id',userController.updateUser)
    fastify.delete('/user/delete/:id',userController.deleteUser)
    fastify.put('/user/update/password/:id',userController.updatePass)
    fastify.post('/user/logout',authController.logout)
    fastify.get('/user',userController.findUser)
    // google
    fastify.get("/login/success",async(req,reply)=>{
       try {
        const user=await User.findOne({email:req.user.email})
        const token=jwt.sign({id:user._id,admin:user.admin},process.env.SECRET)
        reply
        .setCookie("accessCookie",token, {path:'/',httpOnly:true})
        .code(200)
        .send(user)
       } catch (err) {
         reply.send(err)
       }
    })
    fastify.get("/auth/google",fastifyPassport.authenticate("google", {scope:["email","profile"]}))
    fastify.get("/auth/google/callback",fastifyPassport.authenticate("google", { 
      failureRedirect: `${CLIENT_URL}/login`,
      successRedirect: CLIENT_URL
  }));
  // github
  fastify.get("/auth/github",fastifyPassport.authenticate("github", {scope:["email","profile"]}))
  fastify.get("/auth/github/callback", fastifyPassport.authenticate("github",{
    failureRedirect: `${CLIENT_URL}/login`,
    successRedirect: CLIENT_URL
  }))
    done()
}

module.exports=userRouter
const paymentController=require('../controller/payment')
const {checkLogin} =require('../verifyToken')

async function paymentRouter(fastify,_,done){
    fastify.post('/create_payment_url',{preHandler:checkLogin},paymentController.create_payment_url)
    fastify.get('/vnpay_return',{preHandler:checkLogin},paymentController.vnpay_return)
    fastify.get('/vnpay_ipn',{preHandler:checkLogin},paymentController.vnpay_ipn)  
    done()
}
module.exports=paymentRouter

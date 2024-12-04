const orderController=require('../controller/Order')
const {checkLogin}=require('../verifyToken')

async function orderRouter(fastify,_,done){
    fastify.post('/order/create',{preHandler:checkLogin},orderController.creatOrder)
    fastify.get('/order/getByUser',{preHandler:checkLogin},orderController.orderByUser)
    fastify.delete('/order/delete/:id',{preHandler:checkLogin},orderController.deleteOrder)
    fastify.get('/order/all',{preHandler:checkLogin},orderController.orderAll)
    fastify.put('/order/update/:id',{preHandler:checkLogin},orderController.UpdateOrder)



    done();
}

module.exports=orderRouter
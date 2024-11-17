const commentController=require('../controller/comment')
const {checkLogin}=require('../verifyToken')
async function commentRouter(fastify,_,done){
    fastify.post('/comment/create/:id',{preHandler:checkLogin},commentController.createComment)
    fastify.get('/comment/getAll/:id',commentController.getAll)

    

    done()
}
module.exports=commentRouter
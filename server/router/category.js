const categoryController=require('../controller/Category')

async function categoryRouter(fastify,_,done){
    fastify.post('/category/create',categoryController.create)
    fastify.delete('/category/delete/:id',categoryController.delete)
    fastify.get('/category',categoryController.findAll)

    done()
}
module.exports=categoryRouter
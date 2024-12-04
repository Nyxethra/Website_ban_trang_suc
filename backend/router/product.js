const productController=require('../controller/Product')


async function productRouter(fastify,_,done){
    fastify.post('/product/create',productController.create)
    fastify.get('/product/new',productController.ProductNew)
    fastify.put('/product/update/:id',productController.update)
    fastify.get('/product/:id',productController.getOne)
    fastify.get('/product/category/:id',productController.getByCategoryId)
    fastify.get('/product',productController.findProduct)
    fastify.get('/product/productByAllCategory',productController.ProductByCategory)
    fastify.delete('/product/delete/:id',productController.delete)
    done()
}

module.exports=productRouter

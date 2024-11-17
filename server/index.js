const fastify=require('fastify')({logger:true})
const path=require('path')
const connect=require('./config/db')
const fs= require('fs')
require('dotenv').config()
const fastifySession=require('@fastify/secure-session')
require('./controller/passport')

fastify.register(require('@fastify/formbody'))
fastify.register(require('fastify-multer').contentParser);
fastify.register(require('./router/user'))
fastify.register(require('./router/product'))
fastify.register(require('./router/category'))
fastify.register(require('./router/cart'))
fastify.register(require('./router/payment'))

fastify.register(require('./router/comment'))
fastify.register(require('./router/order'))


fastify.register(require('@fastify/cookie'))


fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public/upload/'),
    prefix:'/upload'
  })
fastify.register(require('@fastify/cors'), {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
    preflightContinue: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

fastify.register(fastifySession,{
  key:fs.readFileSync(path.join(__dirname,'not-so-secret-key')),
  cookie:{
    path:'/'
  },
  cookieName:'accessCookie'
})
const fastifyPassport=require('@fastify/passport')
fastify.register(fastifyPassport.initialize())
fastify.register(fastifyPassport.secureSession())
//



const start=async()=>{
    try {
        await fastify.listen(5000)
        console.log('Server is running on port 5000')
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}
connect()
start()
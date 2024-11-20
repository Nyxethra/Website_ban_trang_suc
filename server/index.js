const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
const cookie = require('@fastify/cookie');
const session = require('@fastify/session');
const cors = require('@fastify/cors');
const adminRoutes = require('./routes/admin');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/shop')
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const start = async () => {
    try {
        // Đăng ký CORS
        fastify.register(cors, {
            origin: 'http://localhost:3000',
            credentials: true
        });

        // Đăng ký cookie
        fastify.register(cookie);

        // Đợi cookie được đăng ký hoàn tất
        await fastify.after();
        
        // Đăng ký session
        fastify.register(session, {
            cookieName: 'sessionId',
            secret: 'this-is-a-very-long-secret-key-that-is-at-least-32-characters',
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            },
            saveUninitialized: false
        });

        // Đăng ký routes admin
        fastify.register(adminRoutes, { prefix: '/admin' });

        // Khởi động server
        await fastify.listen({ 
            port: 5000,
            host: '0.0.0.0'
        });
        console.log(`Server is running on port 5000`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
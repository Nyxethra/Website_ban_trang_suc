const fastify = require('fastify')({ logger: true });
const adminRoutes = require('./routes/admin');

fastify.register(adminRoutes, { prefix: '/admin' });

const start = async () => {
  try {
    await fastify.listen(5000);
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 
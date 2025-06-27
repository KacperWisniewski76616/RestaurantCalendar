const Fastify = require('fastify')
const path = require('path')
const fastifyStatic = require('@fastify/static')
const fastifyCors = require('@fastify/cors')
const dotenv = require('dotenv')
const routes = require('./routes')
const {initUsers} = require("./controllers/auth.controller");
const cors = require('@fastify/cors');
dotenv.config()

const fastify = Fastify({ logger: true })

fastify.register(fastifyCors, {
    origins: [
        'http://localhost:5173/',
        'http://127.0.0.1:7070/',
        'http://34.116.235.254:7070/'
    ],
})

fastify.register(routes, { prefix: '/api' })

fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../client/dist'),
    prefix: '/',
})

fastify.setNotFoundHandler(function (request, reply) {
    if (request.raw.method === 'GET' && !request.raw.url.startsWith('/api')) {
        reply.type('text/html').sendFile('index.html')
    } else {
        reply.status(404).send({ error: 'Not found' })
    }
})

const start = async () => {
    try {
        await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()
    .then(() => {
        console.log(`Server started at port: ${process.env.PORT}`)
        initUsers().then(() => console.log('[INIT] USERS'))
    })
    .catch((e) => console.log('Error here: ', e))

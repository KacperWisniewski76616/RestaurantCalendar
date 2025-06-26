const authRoutes = require('./auth.routes')
const reservationsRoutes = require('./reservations.routes')
const tablesRoutes = require('./tables.routes')

module.exports =  async function (fastify) {
    fastify.register(authRoutes, {prefix: '/auth'})
    fastify.register(reservationsRoutes, {prefix: '/reservations'})
    fastify.register(tablesRoutes, {prefix: '/tables'})

    return
}
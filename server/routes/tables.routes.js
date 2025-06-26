const TablesController = require('../controllers/tables.controller')

module.exports = async function (fastify) {
    fastify.get('/', {}, async () => await TablesController.getAll())
    fastify.post('/new', {}, async (request) => await TablesController.createNew(request.body))

    return
}
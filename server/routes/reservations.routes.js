const ReservationsController = require("../controllers/reservations.controller")
module.exports = async function (fastify) {
    fastify.get('/', {}, async (request) => await ReservationsController.getAllAfterToday())
    fastify.post('/new', {}, async (request) => await ReservationsController.createNew(request.body))

    return
}
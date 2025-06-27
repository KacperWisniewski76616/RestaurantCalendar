const ReservationsController = require("../controllers/reservations.controller")
module.exports = async function (fastify) {
    fastify.get('/', {}, async (request) => await ReservationsController.getAllAfterToday())
    fastify.post('/new', {}, async (request) => await ReservationsController.createNew(request.body))
    fastify.delete('/:id', {}, async (request) => await ReservationsController.deleteReservation(request.params.id))
    fastify.put('/:id', {}, async (request) => await ReservationsController.updateReservation(request.params.id, request.body))

    return
}
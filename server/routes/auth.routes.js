const AuthController = require("../controllers/auth.controller");
module.exports = async function (fastify) {
    fastify.post('/login', {}, async (request) => await AuthController.login(request.body));
    fastify.get('/users', {}, async (request) => await AuthController.getUsers());

    return
}
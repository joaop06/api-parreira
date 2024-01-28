const AuthenticationController = require('../controllers/AuthenticationController.js')

class AuthenticationRoute {
    constructor(app) {
        this.app = app
        this.controller = new AuthenticationController()
    }
}

module.exports = AuthenticationRoute
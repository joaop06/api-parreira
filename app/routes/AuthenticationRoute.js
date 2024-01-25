const AuthenticationController = require('../controllers/AuthenticationController.js')

class AuthenticationRoute {
    constructor(app) {
        this.app = app
        this.controller = new AuthenticationController()
        this._initRoutes()
    }

    _initRoutes() {
        // this.app.get(`/login`, this.controller.login.bind(this.controller))
    }
}

module.exports = AuthenticationRoute
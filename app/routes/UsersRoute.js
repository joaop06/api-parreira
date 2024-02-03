const CommonRoute = require('./CommonRoute.js')
const UsersController = require('../controllers/UsersController.js')

class UsersRoute extends CommonRoute {
    constructor(app) {
        super(app, new UsersController(), 'users')
    }

    _initRoutes() {
        super._initRoutes()
        this.app.post(`/login`, this.controller.login.bind(this.controller))
        this.app.post(`/recover-password`, this.controller.recoverPassword.bind(this.controller))
        this.app.post(`/send-email-recover-password`, this.controller.sendEmailRecoverPassword.bind(this.controller))
    }
}

module.exports = UsersRoute
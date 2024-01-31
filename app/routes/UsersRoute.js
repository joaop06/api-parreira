const CommonRoute = require('./CommonRoute.js')
const UsersController = require('../controllers/UsersController.js')

class UsersRoute extends CommonRoute {
    constructor(app) {
        super(app, new UsersController(), 'users')
    }

    _initRoutes() {
        super._initRoutes()
        this.app.post(`/login`, this.controller.login.bind(this.controller))
    }
}

module.exports = (app) => { return new UsersRoute(app) }
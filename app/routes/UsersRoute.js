const CommonRoute = require('./CommonRoute.js')
const UsersController = require('../controllers/UsersController.js')

class UsersRoute extends CommonRoute {
    constructor(app) {
        super(app, new UsersController(), 'users')
        this._initRoutes()
    }

    _initRoutes() {
        super._initRoutes()
    }
}

module.exports = UsersRoute
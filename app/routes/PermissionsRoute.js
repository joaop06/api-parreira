const CommonRoute = require('./CommonRoute.js')
const PermissionsController = require('../controllers/PermissionsController.js')

class PermissionsRoute extends CommonRoute {
    constructor(app) {
        super(app, new PermissionsController(), 'permissions')
    }

    _initRoutes() {
        super._initRoutes()
    }
}

module.exports = PermissionsRoute
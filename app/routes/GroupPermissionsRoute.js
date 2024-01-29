const CommonRoute = require('./CommonRoute.js')
const GroupPermissionsController = require('../controllers/GroupPermissionsController.js')

class GroupPermissionsRoute extends CommonRoute {
    constructor(app) {
        super(app, new GroupPermissionsController(), 'group-permissions')
        this._initRoutes()
    }

    _initRoutes() {
        super._initRoutes()
    }
}

module.exports = GroupPermissionsRoute
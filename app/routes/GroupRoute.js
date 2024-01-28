const CommonRoute = require('./CommonRoute.js')
const GroupController = require('../controllers/GroupController.js')

class GroupRoute extends CommonRoute {
    constructor(app) {
        super(app, new GroupController(), 'group')
        this._initRoutes()
    }

    _initRoutes() {
        super._initRoutes()
    }
}

module.exports = GroupRoute
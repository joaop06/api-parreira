const CommonRoute = require('./CommonRoute.js')
const GroupController = require('../controllers/GroupController.js')

class GroupRoute extends CommonRoute {
    constructor(app) {
        super(app, new GroupController(), 'group')
    }

    _initRoutes() {
        super._initRoutes()
    }
}

module.exports = GroupRoute
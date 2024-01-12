const CommonRoute = require('./CommonRoute.js')
const ClientController = require('../controllers/ClientController.js')

class ClientRoute extends CommonRoute {
    constructor(app) {
        super(app, new ClientController(), 'client')
        this._initRoutes()
    }

    _initRoutes() {
        super._initRoutes()
    }
}

module.exports = ClientRoute
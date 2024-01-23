const CommonRoute = require('./CommonRoute.js')
const ServiceOrderController = require('../controllers/ServiceOrderController.js')

class ServiceOrderRoute extends CommonRoute {
    constructor(app) {
        super(app, new ServiceOrderController(), 'service-order')
        this._initRoutes()
    }

    _initRoutes() {
        super._initRoutes()
    }
}

module.exports = ServiceOrderRoute
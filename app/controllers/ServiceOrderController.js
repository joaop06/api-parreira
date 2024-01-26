const { attrs } = require('../models/ServiceOrder.js')()
const CommonController = require('./CommonController.js')
const ServiceOrderService = require('../services/ServiceOrderService.js')

class ServiceOrderController extends CommonController {
    constructor() {
        super(ServiceOrderService, 'ServiceOrder', attrs)
    }
}

module.exports = ServiceOrderController
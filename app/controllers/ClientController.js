const { attrs } = require('../models/Client.js')()
const CommonController = require('./CommonController.js')
const ClientService = require('../services/ClientService.js')

class ClientController extends CommonController {
    constructor() {
        super(ClientService, 'Client', attrs)
    }
}

module.exports = ClientController
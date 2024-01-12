const CommonService = require('./CommonService.js')

class ClientService extends CommonService {
    constructor(models, modelName) {
        super(models, modelName)
    }
}

module.exports = ClientService
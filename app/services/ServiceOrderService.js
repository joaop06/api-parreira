const CommonService = require('./CommonService.js')

class ServiceOrderService extends CommonService {
    constructor(models, modelName) {
        super(models, modelName)
    }

    async findAndCountAll(req, options) {
        options.include = [{ model: this.models.Client }]
        return await super.findAndCountAll(req, options)
    }
}

module.exports = ServiceOrderService
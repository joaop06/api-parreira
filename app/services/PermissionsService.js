const CommonService = require('./CommonService.js')

class PermissionsService extends CommonService {
    constructor(models, modelName) {
        super(models, modelName)
    }
}

module.exports = PermissionsService
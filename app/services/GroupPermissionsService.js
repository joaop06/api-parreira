const CommonService = require('./CommonService.js')

class GroupPermissionsService extends CommonService {
    constructor(models, modelName) {
        super(models, modelName)
    }
}

module.exports = GroupPermissionsService
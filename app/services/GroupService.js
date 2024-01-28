const CommonService = require('./CommonService.js')

class GroupService extends CommonService {
    constructor(models, modelName) {
        super(models, modelName)
    }
}

module.exports = GroupService
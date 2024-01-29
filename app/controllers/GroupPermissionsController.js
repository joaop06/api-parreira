const { attrs } = require('../models/GroupPermissions.js')()
const CommonController = require('./CommonController.js')
const GroupPermissionsService = require('../services/GroupPermissionsService.js')

class GroupPermissionsController extends CommonController {
    constructor() {
        super(GroupPermissionsService, 'GroupPermissions', attrs)
    }
}

module.exports = GroupPermissionsController
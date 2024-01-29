const { attrs } = require('../models/Permissions.js')()
const CommonController = require('./CommonController.js')
const PermissionsService = require('../services/PermissionsService.js')

class PermissionsController extends CommonController {
    constructor() {
        super(PermissionsService, 'Permissions', attrs)
    }
}

module.exports = PermissionsController
const { attrs } = require('../models/Group.js')()
const CommonController = require('./CommonController.js')
const GroupService = require('../services/GroupService.js')

class GroupController extends CommonController {
    constructor() {
        super(GroupService, 'Group', attrs)
    }
}

module.exports = GroupController
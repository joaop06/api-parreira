const { attrs } = require('../models/Users.js')
const CommonController = require('./CommonController.js')
const UsersService = require('../services/UsersService.js')

class UsersController extends CommonController {
    constructor() {
        super(UsersService, 'Users', attrs)
    }
}

module.exports = UsersController
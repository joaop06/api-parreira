const { attrs } = require('../models/Users.js')()
const CommonController = require('./CommonController.js')
const UsersService = require('../services/UsersService.js')

class UsersController extends CommonController {
    constructor() {
        super(UsersService, 'Users', attrs)
    }

    async login(req, res, next) {
        try {
            const result = await this.service.login(req.body, req)
            res.status(result.status).send({ ...result.data })

        } catch (e) {
            next(e)
        }
    }
}

module.exports = UsersController
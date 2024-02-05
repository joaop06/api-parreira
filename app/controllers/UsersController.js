const { attrs } = require('../models/Users.js')()
const CommonController = require('./CommonController.js')
const UsersService = require('../services/UsersService.js')

class UsersController extends CommonController {
    constructor() {
        super(UsersService, 'Users', attrs)
    }

    async login(req, res, next) {
        try {
            const result = await this.service.login(req.body)
            res.status(200).send(result)

        } catch (e) {
            next(e)
        }
    }

    async recoverPassword(req, res, next) {
        try {
            const result = await this.service.recoverPassword(req)
            res.status(200).send(result)

        } catch (e) {
            next(e)
        }
    }

    async sendEmailRecoverPassword(req, res, next) {
        try {
            const result = await this.service.sendEmailRecoverPassword(req.body)
            res.status(200).send(result)

        } catch (e) {
            next(e)
        }
    }
}

module.exports = UsersController
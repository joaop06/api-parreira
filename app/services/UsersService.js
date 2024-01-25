const CommonService = require('./CommonService.js')
const Encrypt = require('../Utils/Encrypt.js')

class UsersService extends CommonService {
    constructor(models, modelName) {
        super(models, modelName)
    }

    async create(object, req, options) {
        const hash = await Encrypt.createHash(object.password)

        return await super.create({ ...object, password: hash }, req, options)
    }
}

module.exports = UsersService
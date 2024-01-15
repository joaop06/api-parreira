const CommonService = require('./CommonService.js')

class ClientService extends CommonService {
    constructor(models, modelName) {
        super(models, modelName)
    }

    async create(req, options, next) {
        try {
            const object = req.body

            const verifyRegister = await super.findOne({ where: { document: object.document } }, next)
            if (verifyRegister) throw Object.assign(new Error('Documento já cadastrado'), { statusCode: 409 })

            return await super.create(object)

        } catch (e) {
            next(e)
        }
    }
}

module.exports = ClientService
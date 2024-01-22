const CommonService = require('./CommonService.js')

class ClientService extends CommonService {
    constructor(models, modelName) {
        super(models, modelName)
    }

    async create(object, req, options) {
        try {

            const verifyRegister = await super.findOne({ where: { document: object.document } })
            if (verifyRegister) throw Object.assign(new Error('Documento já cadastrado'), { statusCode: 409 })

            return await super.create(object)

        } catch (e) {
            throw e
        }
    }
}

module.exports = ClientService
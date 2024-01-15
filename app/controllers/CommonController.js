const models = require('../models')

class CommonController {
    constructor(service, modelName, modelAttrs) {
        this._initController(service, modelName, modelAttrs)
    }

    async _initController(service, modelName, modelAttrs) {
        this.models = await models()
        this.modelName = modelName
        this.service = new service(this.models, this.modelName)
        this.modelAttrs = modelAttrs || []
    }

    async findAndCountAll(req, res, next) {
        try {
            const result = await this.service.findAndCountAll(req, undefined, next)
            return res.status(200).send(result)

        } catch (e) {
            next(e)
        }
    }
    async create(req, res, next) {
        let transaction
        try {
            transaction = await this.models.sequelize.transaction()
            await this.service.create(req, { transaction }, next)
            await transaction.commit()
            return res.status(201).end()

        } catch (e) {
            if (transaction) await transaction.rollback()
            next(e)
        }
    }
    async update(req, res, next) {
        let transaction
        try {
            transaction = await this.models.sequelize.transaction()
            const result = await this.service.update(req, { transaction }, next)
            await transaction.commit()
            return res.status(200).send(result)

        } catch (e) {
            if (transaction) await transaction.rollback()
            next(e)
        }
    }
    async delete(req, res, next) {
        let transaction
        try {
            transaction = await this.models.sequelize.transaction()
            const result = await this.service.delete(req, { transaction }, next)

            if (result !== 1) throw Object.assign(new Error('Erro ao deletar'), { statusCode: 400 })

            await transaction.commit()
            return res.status(200).send({ message: 'Sucesso ao deletar!' })

        } catch (e) {
            if (transaction && !transaction.finished) await transaction.rollback()
            next(e)
        }
    }

    async treatRequestQuery(req, options = {}) {

    }
}

module.exports = CommonController
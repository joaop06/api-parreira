
class CommonService {
    constructor(models, modelName) {
        this.models = models
        this.modelName = modelName
    }

    async findAndCountAll(req, options = { where: req?.query?.id ? { id: req?.query?.id } : {} }) {
        try {
            return await this.models[this.modelName].findAndCountAll(options)

        } catch (e) {
            throw e
        }
    }
    async create(object, req, options) {
        try {
            return await this.models[this.modelName].create(object, options)

        } catch (e) {
            throw e
        }
    }
    async update(object, req, options) {
        try {
            return await this.models[this.modelName].update(object, {
                ...options,
                where: ([undefined, null].includes(object?.id) && [undefined, null].includes(options?.where?.id)) ?
                    { ...options.where } : { ...options.where, id: object.id || options.where.id || req.query?.id }
            })

        } catch (e) {
            throw e
        }
    }
    async delete(req, options) {
        try {
            const { id } = req.query
            return await this.models[this.modelName].destroy({ where: { id } })

        } catch (e) {
            throw e
        }
    }

    async findOne(options) {
        try {
            return await this.models[this.modelName].findOne(options)
        } catch (e) {
            throw e
        }
    }
}

module.exports = CommonService
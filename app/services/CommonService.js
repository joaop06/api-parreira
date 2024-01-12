
class CommonService {
    constructor(models, modelName) {
        this.models = models
        this.modelName = modelName
    }

    async findAndCountAll(req, next) {
        try {
            return await this.models[this.modelName].findAndCountAll()

        } catch (e) {
            next(e)
        }
    }
    async create(req, options, next) {
        try {
            const object = req.body
            return await this.models[this.modelName].create(object)

        } catch (e) {
            next(e)
        }
    }
    async update(req, options, next) {
        try {
            const object = req.body
            const { id } = req.query
            return await this.models[this.modelName].update(object, { where: { id } })

        } catch (e) {
            next(e)
        }
    }
    async delete(req, options, next) {
        try {
            const { id } = req.query
            return await this.models[this.modelName].destroy({ where: { id } })

        } catch (e) {
            next(e)
        }
    }
}

module.exports = CommonService
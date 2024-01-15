
class CommonService {
    constructor(models, modelName) {
        this.models = models
        this.modelName = modelName
    }

    async findAndCountAll(req, options = {
        where: req?.query?.id ? { id: req?.query?.id } : {}
    }, next) {
        try {
            Object.entries(req.query).map(([key, value]) => {
                if (this.models[this.modelName].tableAttributes[key]) {
                    options.where[key] = value
                }
            })

            return await this.models[this.modelName].findAndCountAll(options)

        } catch (e) {
            next(e)
        }
    }
    async create(object, options, next) {
        try {
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

    async findOne(options, next) {
        try {
            return await this.models[this.modelName].findOne(options)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = CommonService
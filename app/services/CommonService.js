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
            /**
             * Procura o ID no objeto de update, query da requisição ou no `options.where` (Respectivamente)
             * Caso não encontre, usará as demais condições { ...options.where }
             */
            const where = object?.id || req?.query?.id || options?.where?.id ?
                { ...options.where, id: object?.id || req?.query?.id || options?.where?.id } : { ...options.where }


            // Erro caso where seja vazio
            if (Object.keys(where).length === 0) {
                throw Object.assign(new Error('Condição para atualizar não informada'), { statusCode: 400 })
            }

            return await this.models[this.modelName].update(object, { ...options, where })

        } catch (e) {
            throw e
        }
    }
    async delete(options) {
        try {
            // Erro caso where seja vazio
            if (Object.keys(options?.where).length === 0) {
                throw Object.assign(new Error('Condição para deletar não informada'), { statusCode: 400 })
            }

            return await this.models[this.modelName].destroy(options)

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

    async findAll(options) {
        try {
            return await this.models[this.modelName].findAll(options)
        } catch (e) {
            throw e
        }
    }

    async tableAttributes(modelAttrs, excludeAttrs = []) {
        try {
            return Object.keys(this.models[this.modelName].tableAttributes)
                .map(attr => {
                    if (attr === "createdAt") {
                        return {
                            field: "createdAt",
                            type: "datatime",
                            allowNull: true,
                            label: "Criado em"
                        }

                    } else if (attr === "updatedAt") {
                        return {
                            field: "updatedAt",
                            type: "datatime",
                            allowNull: true,
                            label: "Atualizado em"
                        }

                    } else {
                        return { field: attr, ...modelAttrs[attr] }
                    }
                })
                .filter(attr => !excludeAttrs.includes(attr.field) && attr.field !== 'deletedAt')

        } catch (e) {
            throw e
        }
    }
}

module.exports = CommonService
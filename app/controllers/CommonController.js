const models = require('../models')
const { Op } = require('sequelize')
const CommonService = require('../services/CommonService')

class CommonController {
    constructor(service, modelName, modelAttrs) {
        if (!service && !modelName && !modelAttrs) {
            this.service = new CommonService()
        } else {
            this._initController(service, modelName, modelAttrs)
        }
    }

    async _initController(service, modelName, modelAttrs) {
        this.models = await models()
        this.modelName = modelName
        this.service = new service(this.models, this.modelName)
        this.modelAttrs = modelAttrs || []
    }

    async findAndCountAll(req, res, next) {
        try {
            const options = await this.treatRequestQuery(req)
            const result = await this.service.findAndCountAll(req, options)
            return res.status(200).send({ totalCount: result.count, totalRecords: result.rows.length, rows: result.rows })

        } catch (e) {
            next(e)
        }
    }
    async create(req, res, next) {
        let transaction
        try {
            transaction = await this.models.sequelize.transaction()
            await this.service.create(req.body, req, { transaction })

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
            const result = await this.service.update(req.body, req, { transaction })
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
            const options = await this.treatRequestQuery(req)
            const rowsDeleted = await this.service.delete({ ...options, transaction })
            await transaction.commit()


            if (rowsDeleted < 1) {
                return res.status(200).send({ message: `Nenhum registro encontrado para deletar` })
            } else {
                return res.status(200).send({ message: `Sucesso ao deletar ${rowsDeleted} registro(s)!` })
            }

        } catch (e) {
            if (transaction && !transaction.finished) await transaction.rollback()
            next(e)
        }
    }

    async tableAttributes(req, res, next) {
        try {
            return res.status(200).send(await this.service.tableAttributes(this.modelAttrs))
        } catch (e) {
            next(e)
        }
    }


    async treatRequestQuery(req) {
        // Tratativa Where
        let where = {}
        await Promise.all(Object.keys(req.query)
            .filter(key => typeof req.query[key] === 'object')
            .map(async (key) => {
                if (Array.isArray(req.query[key])) {
                    where[key] = { [Op.in]: await Promise.all(req.query[key].map((value) => this.typeAttributeQuery(value, key))) }
                } else {
                    where[key] = req.query[key]
                }
            })
        )

        await Promise.all(Object.keys(req.query)
            .filter(key => typeof req.query[key] !== 'object')
            .map(async (key) => { where[key] = await this.mapOrAttr(req.query[key], key, req.route.path) })
        )

        // Remove atributo não existente na tabela
        await Promise.all(Object.keys(where)
            .filter(key => !Object.keys(this.modelAttrs).includes(key))
            .map(key => { delete where[key] }))


        // Busca de valores parciais
        await Promise.all(Object.keys(where)
            .filter(key => typeof where[key] === 'string')
            .filter(key => where[key].includes('%'))
            .map(key => { where[key] = { [Op.like]: where[key] } })
        )

        // Paginação
        let limit = req.query.perPage ? Number(req.query.perPage) : 10
        let offset = (req.query.page ? Number(req.query.page) - 1 : 0) * limit

        // Ordenação
        let order
        if (Array.isArray(req?.query?.sort_field)) {
            order = [...req.query.sort_field.map((field, i) => ([req.query.sort_field[i], req.query.sort_type[i]]))]
        }


        return { limit, offset, where, order }
    }

    typeAttributeQuery(value, key) {
        // Valor Inteiro
        if (['id', '_id'].includes(key) && !isNaN(value)) return parseInt(value)

        // Valor Booleano
        else if (['false', 'true'].includes(value)) return (value === 'true')

        // Valor padrão (String)
        else return value
    }

    async mapOrAttr(value, key, route) {
        if (typeof value !== 'string') return this.typeAttributeQuery(value, k)

        let query = []
        // Busca multipla de valores em um mesmo campo
        let custom = ['id', 'name', 'document']
        // let custom = []
        // if (route == '/clients') {
        //     custom = ['id', 'email', 'phone', 'cpf_cnpj']
        // } else {
        //     custom = ['name', 'id', 'produto_chave', 'ean', 'erp_product_id', 'ecom_product_id', 'invoice', 'printer', 'sale_id']
        // }

        if (value.includes(';')) {
            query = value.split(';').map(el => el.replace(/\n/g, '')).filter(el => el != '')

        } else if (value.includes(',') && custom.includes(key)) {
            query = value.split(',').map(el => el.replace(/\n/g, '')).filter(el => el != '')

        } else if (value.includes(' ') && custom.includes(key)) {
            query = value.split(' ').map(el => el.replace(/\n/g, '')).filter(el => el != '')
        }

        if (query.length <= 1) return this.typeAttributeQuery(value, key)


        return { [Op.or]: await Promise.all(query.map(value => this.typeAttributeQuery(value.trim(), key))) }
    }
}

module.exports = CommonController

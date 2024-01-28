const CommonService = require('./CommonService.js')
const Encrypt = require('../Utils/Encrypt.js')
const { Op } = require('sequelize')

class UsersService extends CommonService {
    constructor(models, modelName) {
        super(models, modelName)
    }

    async login(object, req) {
        try {
            if (!((object.username || object.email) && object.password)) {
                throw Object.assign(new Error('Credenciais não informadas'), { statusCode: 400 })
            }

            // Busca usuário pelo Username ou E-mail
            const user = await super.findOne({
                where: object.username ? { username: object.username } : { email: object.email }
            })
            if (!user) throw Object.assign(new Error('Usuário não encontrado'), { statusCode: 404 })


            // Verifica senha criptografada
            await Encrypt.compare(object.password, user.password).then(res => {
                if (!res) throw Object.assign(new Error('Senha inválida'), { statusCode: 401 })
            })


            return { status: 200, data: { message: 'Login realizado' } }

        } catch (e) {
            throw e
        }
    }

    async create(object, req, options) {
        // Verifica dados duplicados
        const verifyData = await super.findOne({
            where: {
                [Op.or]: [
                    { username: object.username },
                    { email: object.email }
                ]
            }
        })
        if (verifyData) throw Object.assign(new Error('Nome de Usuário e/ou E-mail já cadastrado(s)'), { statusCode: 409 })

        // Codifica a senha
        const hash = await Encrypt.createHash(object.password)

        return await super.create({ ...object, password: hash }, req, options)
    }
}

module.exports = UsersService
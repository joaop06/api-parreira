const { Op } = require('sequelize')
const Encrypt = require('../Utils/Encrypt.js')
const CommonService = require('./CommonService.js')
const AuthenticationService = require('./AuthenticationService.js')

class UsersService extends CommonService {
    constructor(models, modelName) {
        super(models, modelName)
    }

    async login(object) {
        try {
            const { username, email, password } = object

            if (!((username || email) && password)) {
                throw Object.assign(new Error('Credenciais não informadas'), { statusCode: 400 })
            }

            // Busca usuário pelo Username ou E-mail
            const user = await super.findOne({
                where: username ? { username: username } : { email: email },
                include: [{
                    model: this.models.Group,
                    include: [{ model: this.models.Permissions }]
                }]
            }).then((el) => (el ? el.toJSON() : el))

            // Usuário não cadastrado ou Inativo
            if (!user || user.active === false) {
                throw Object.assign(new Error('Usuário não encontrado ou Inativo'), { statusCode: 404 })
            }

            // Verificação de senha criptografada
            await Encrypt.compare(password, user.password).then(res => {
                if (!res) throw Object.assign(new Error('Credenciais inválidas'), { statusCode: 401 })
            })


            // Gerar token
            let token = await AuthenticationService.getToken(user)

            return {
                redirect: "/",
                message: 'Login realizado',
                jwt: token,
                permissions: user.Group.Permissions,
                group_id: user.Group.id
            }

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
        if (verifyData) throw Object.assign(new Error('Usuário e/ou E-mail já cadastrado(s)'), { statusCode: 409 })

        if (!object.group_id) throw Object.assign(new Error('Grupo do Usuário não informado'), { statusCode: 400 })


        // Codifica a senha
        const hash = await Encrypt.createHash(object.password)

        return await super.create({ ...object, password: hash }, req, options)
    }
}

module.exports = UsersService
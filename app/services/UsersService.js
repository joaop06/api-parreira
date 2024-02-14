const moment = require('moment')
const { Op } = require('sequelize')
const Encrypt = require('../Utils/Encrypt.js')
const SendEmail = require('../Utils/SendEmail.js')
const CommonService = require('./CommonService.js')
const AuthenticationService = require('./AuthenticationService.js')

class UsersService extends CommonService {
    constructor(models, modelName) {
        super(models, modelName)

        const sendEmail = new SendEmail()
        this.sendEmail = sendEmail
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
            let token = await AuthenticationService.getToken(user, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN)

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

    async findAndCountAll(req, options) {
        options.include = [{ model: this.models.Group }]

        return super.findAndCountAll(req, options)
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

    async tableAttributes(modelAttrs) {
        try {
            return await super.tableAttributes(modelAttrs, ['password'])

        } catch (e) {
            throw e
        }
    }

    async recoverPassword(req) {
        try {
            const password = await Encrypt.createHash(req.body.new_password)
            const { id, name, email } = req.recoverPass

            // Atualiza a nova senha
            await this.models.Users.update({ password }, { where: { id } }).then(async (res) => {
                if (!res || res[0] !== 1) {
                    throw Object.assign(new Error('Erro ao atualizar nova senha'), { statusCode: 400 })
                }

                const token = await AuthenticationService.getToken(
                    { id, email, isRecoverPass: true },
                    process.env.JWT_SECRET_RECOVER_PASS,
                    process.env.JWT_RECOVER_PASS_EXPIRES_IN
                )

                this.sendEmail.sendMail({
                    to: email,
                    subject: 'Alteração de Senha Realizada',
                    html: SendEmail.htmlPasswordChanged(name, token, moment(new Date()).format('DD/MM/YYYY'), req._remoteAddress.replace('::ffff:', ''))
                })
            })

            return { message: 'Senha alterada com sucesso' }

        } catch (e) {
            throw e
        }
    }

    async sendEmailRecoverPassword(object) {
        try {
            const user = await super.findOne({ where: { ...object } })
            if (!user) throw new Error('Usuário não encontrado')

            const { id, name, email } = user
            const token = await AuthenticationService.getToken(
                { id, email, name, ...object, isRecoverPass: true },
                process.env.JWT_SECRET_RECOVER_PASS,
                process.env.JWT_RECOVER_PASS_EXPIRES_IN
            )

            // Parâmetros possíveis { to, subject, html, attachments }
            return await this.sendEmail.sendMail({
                to: user.email,
                subject: 'Solicitação de redefinição de Senha',
                html: SendEmail.messageToSendEmail(user.name, token)
            })

        } catch (e) {
            throw e
        }
    }
}

module.exports = UsersService
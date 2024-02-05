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
            const { id, email } = req.recoverPass

            // Atualiza a nova senha
            await this.models.Users.update({ password }, { where: { id } }).then(res => {
                if (!res || res[0] !== 1) {
                    throw Object.assign(new Error('Erro ao atualizar nova senha'), { statusCode: 400 })
                }
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

            const token = await AuthenticationService.getToken(
                {
                    id: user.id,
                    email: user.email,
                    ...object,
                    isRecoverPass: true
                },
                process.env.JWT_SECRET_RECOVER_PASS,
                process.env.JWT_RECOVER_PASS_EXPIRES_IN
            )

            const html = await this.mountHtmlToSendEmail(user.name, token)

            // Parâmetros possíveis { to, subject, html, attachments }
            return await this.sendEmail.sendMail({
                to: user.email,
                subject: 'Solicitação de redefinição de Senha',
                html
            })

        } catch (e) {
            throw e
        }
    }

    async mountHtmlToSendEmail(nameUser, token) {
        return `<!DOCTYPE html>
        <html lang="pt-br">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperação de Senha</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background-color: #f4f4f4;
                }
        
                .banner {
                    max-width: 400px;
                    text-align: center;
                    padding: 20px;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                }
        
                h2 {
                    color: #333;
                }
        
                p {
                    color: #666;
                    margin-bottom: 20px;
                }
        
                form {
                    display: flex;
                    flex-direction: column;
                }
        
                label {
                    text-align: left;
                    margin-bottom: 5px;
                    color: #333;
                }
        
                input {
                    padding: 10px;
                    margin-bottom: 15px;
                    width: 100%;
                    box-sizing: border-box;
                }
        
                button {
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 15px;
                }
        
                button:hover {
                    background-color: #0056b3;
                }
        
                a {
                    text-decoration: none;
                    color: white;
                }
        
                request_again {
                    text-decoration: double;
                }
            </style>
        </head>
        
        <body>
            <div class="banner">
                <h2>Recuperação de Senha</h2>
                <p>
                    Olá, ${nameUser.toUpperCase()}!<br />
                    Você será redirecionado a tela de Redefinição de Senha. O link de recuperação expirará em 1 hora.
                </p>
        
                <button type="submit">
                    <a href="https://y74x2h-3000.csb.app/redefinir-senha/${token}" target="_blank">Redefinir Senha</a>
                </button>
            </div>
        </body>
        
        </html>`
    }
}

module.exports = UsersService
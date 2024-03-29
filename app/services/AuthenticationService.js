const jwt = require('jsonwebtoken')

class AuthenticationService {

    static async getToken(data, secret, timeExpires) {
        return jwt.sign(data, secret, { expiresIn: parseInt(timeExpires) })
    }

    static async verifyToken(token, models, options = {}) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    if (err.name == 'TokenExpiredError') {
                        throw Object.assign(new Error('Token de acesso expirado'), { statusCode: 401, send: { redirect: '/login' } })
                    }
                }

                // Retorno para Recuperação de Senha de Usuário
                if (decoded.isRecoverPass) {
                    return { ...decoded }
                }


                // Rotas Permitidas para acesso normal do Usuário
                const result = await models.Group.findOne({
                    where: { id: decoded.group_id },
                    include: [{ model: models.Permissions }],
                    ...options
                })

                return { user: decoded, permissions: result?.Permissions || [] }
            })

        } catch (e) {
            throw e
        }
    }
}

module.exports = AuthenticationService
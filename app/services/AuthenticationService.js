const jwt = require('jsonwebtoken')

class AuthenticationService {

    static async getToken(data) {
        return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.JWT_EXPIRES_IN) })
    }

    static async verifyToken(token, models, options = {}) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    if (err.name == 'TokenExpiredError') {
                        throw Object.assign(new Error('Token de acesso expirado'), { statusCode: 401, send: { redirect: '/login' } })
                    }
                }

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
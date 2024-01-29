const jwt = require('jsonwebtoken')

class AuthenticationService {

    static async getToken(data) {
        return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.JWT_EXPIRES_IN) })
    }

    static async verifyToken(token, models, options = {}) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) return {}

                const result = await models.Group.findOne({
                    where: { id: decoded.group_id },
                    include: [{ model: models.Permissions }],
                    ...options
                })

                return { ...decoded, permissions: result?.Permissions || [] }
            })

        } catch (e) {
            throw e
        }
    }
}

module.exports = AuthenticationService
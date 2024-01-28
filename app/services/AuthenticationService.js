const jwt = require('jsonwebtoken')

class Authentication {

    static async getToken(data) {
        return jwt.sign(data, process.env.JWT_SECRET)
    }

    static async verifyToken() { }
}



module.exports = Authentication
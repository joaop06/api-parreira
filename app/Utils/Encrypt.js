const bcrypt = require('bcrypt')

class Encrypt {

    static async compare(data, encrypted) {
        return await bcrypt.compare(data, encrypted)
    }

    static async createHash(data) {
        return bcrypt.hashSync(data, 10)
    }
}

module.exports = Encrypt
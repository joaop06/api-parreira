const fs = require('fs')

module.exports = async (app) => {
    const basename = 'CommonRoute.js'
    const result = fs.readdirSync(__dirname).filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file !== 'index.js') && (file.slice(-3) === '.js')
    }).map(async (file) => {
        const router = require(`./${file}`)
        try {
            await router(app)
        } catch (error) {
            new router(app)
        }
    })
    await Promise.all(result)
}
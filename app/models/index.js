const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

var db = {}
async function getInstance() {
    return await new Promise((resolve, reject) => {
        try {

            // Nova instância do Sequelize e conexão com o Banco
            const sequelize = new Sequelize(
                process.env.DB_NAME,
                process.env.DB_USERNAME,
                process.env.DB_PASSWORD, {
                dialectOptions: {
                    connectTimeout: 60000 // 1 Minuto
                },
                pool: {
                    max: 5,
                    min: 0,
                    idle: 10000,
                    acquire: 30000,
                },
                host: process.env.DB_HOST,
                warnings: false,
                logging: false,
                dialect: process.env.DB_DIALECT,
                port: process.env.DB_PORT
            })

            console.log(`Connection with DataBase ${process.env.DATABASE} established`)

            // Mapeia os Atributos das Models dentro de `db.modelAttrs`
            db.modelAttrs = []
            fs.readdirSync(__dirname).filter(file => {
                return (file.includes('Attr') && file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
            }).forEach(file => db.modelAttrs.push(file))


            // Define as Models dentro do objeto `db`
            fs.readdirSync(__dirname).filter(file => {
                return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js')
            }).forEach(file => {
                const { model } = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
                db[model.name] = model
            })

            // Define as associações (Relacionamentos)
            Object.keys(db).forEach(modelName => {
                if (db[modelName].associate) {
                    db[modelName].associate(db)
                }
            })

            sequelize.sync({ force: db.force === true })
            db.sequelize = sequelize
            db.Sequelize = Sequelize
            resolve(db)

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = async () => {
    if (db.sequelize) return db
    else return await getInstance()
}

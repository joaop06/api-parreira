const fs = require('fs')
const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


let moduleName = process.argv[2]

if (!moduleName) {
    console.error('Por favor, forneça o nome do módulo.');
    process.exit(1);
}

moduleName = moduleName.includes('-') ? moduleName.split('-') : moduleName.split('_')

const routeName = moduleName.join('-')
const tableName = moduleName.join('_')
const modelName = moduleName.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')

const modelFilePath = `app/models/${modelName}.js`
const routeFilePath = `app/routes/${modelName}Route.js`
const controllerFilePath = `app/controllers/${modelName}Controller.js`
const serciceFilePath = `app/services/${modelName}Service.js`


// Se já existe o Módulo criado
if (fs.existsSync(modelFilePath) || fs.existsSync(routeFilePath) || fs.existsSync(controllerFilePath) || fs.existsSync(serciceFilePath)) {
    readLine.question('Arquivos existentes! Substituir[s] / Deletar[d]: ', (option) => {
        if (option == 's') createModule() // Substituirá arquivos do módulo já criado
        else if (option == 'd') removeModule() // Removerá arquivos do módulo já criado
        process.exit()
    })


} else {
    // Cria arquivos do novo módulo
    createModule()
    process.exit()
}


// Criar arquivos
function createModule() {
    // Cria arquivo Model
    fs.writeFileSync(modelFilePath,
        `module.exports = (sequelize, DataTypes) => {
    const attrs = {
        id: {
            type: DataTypes.INTEGER(20),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            label: 'Id'
        },

    }

    const model = sequelize?.define('${modelName}', attrs, {
        tableName: '${tableName}',
        timestamps: true,
        paranoid: true
    })

    return { model, attrs }
}`
    )


    // Criar arquivo Route
    fs.writeFileSync(routeFilePath,
        `const CommonRoute = require('./CommonRoute.js')
const ${modelName}Controller = require('../controllers/${modelName}Controller.js')

class ${modelName}Route extends CommonRoute {
    constructor(app) {
        super(app, new ${modelName}Controller(), '${routeName}')
        this._initRoutes()
    }

    _initRoutes() {
        super._initRoutes()
    }
}

module.exports = ${modelName}Route`
    )


    // Criar arquivo Controller
    fs.writeFileSync(controllerFilePath,
        `const { attrs } = require('../models/${modelName}.js')
const CommonController = require('./CommonController.js')
const ${modelName}Service = require('../services/${modelName}Service.js')

class ${modelName}Controller extends CommonController {
    constructor() {
        super(${modelName}Service, '${modelName}', attrs)
    }
}

module.exports = ${modelName}Controller`
    )


    // Criar arquivo Service
    fs.writeFileSync(serciceFilePath,
        `const CommonService = require('./CommonService.js')

class ${modelName}Service extends CommonService {
    constructor(models, modelName) {
        super(models, modelName)
    }
}

module.exports = ${modelName}Service`
    )
}

// Remover arquivos
function removeModule() {
    fs.rmSync(modelFilePath)
    fs.rmSync(routeFilePath)
    fs.rmSync(controllerFilePath)
    fs.rmSync(serciceFilePath)
}
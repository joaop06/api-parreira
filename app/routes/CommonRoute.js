const CommonController = require('../controllers/CommonController.js')

class CommonRoute {
    constructor(app, controller, route) {
        this.app = app
        this.controller = controller
        this.route = route

        this._initRoutes()
    }

    _initRoutes() {
        this.app.get(`/${this.route}`, this.controller.findAndCountAll.bind(this.controller))
        this.app.post(`/${this.route}`, this.controller.create.bind(this.controller))
        this.app.put(`/${this.route}`, this.controller.update.bind(this.controller))
        this.app.delete(`/${this.route}`, this.controller.delete.bind(this.controller))
        this.app.get(`/${this.route}/table-attributes`, this.controller.tableAttributes.bind(this.controller))
    }
}

module.exports = CommonRoute
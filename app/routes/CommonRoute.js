
class CommonRoute {
    constructor(app, controller, route) {
        this.app = app
        this.controller = controller
        this.route = route
    }

    _initRoutes() {
        this.app.get(`/${this.route}`, this.controller.findAndCountAll.bind(this.controller))
        this.app.post(`/${this.route}`, this.controller.create.bind(this.controller))
        this.app.put(`/${this.route}`, this.controller.update.bind(this.controller))
        this.app.delete(`/${this.route}`, this.controller.delete.bind(this.controller))
    }
}

module.exports = CommonRoute
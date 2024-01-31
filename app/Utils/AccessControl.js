const modelsFn = require('../models/index.js')
const AuthenticationService = require('../services/AuthenticationService.js')


module.exports = async (req, res, next) => {
    try {
        const models = await modelsFn()

        if (req.path === '/logout') {
            return res.status(200).clearCookie('jwt').send({ redirect: '/login' })
        }

        // Rotas que não precisam de Autenticação
        const noAuth = [
            { path: '/login', method: 'POST' },
            { path: '/users/login', method: 'POST' }
        ]

        // Verifica se o acesso é em algum rota sem Autenticação
        if (noAuth.findIndex(route => route.path === req.path && route.method === req.method) >= 0) {
            return next()
        }

        const token = req.headers.authorization || req.query.authorization

        if (!token) throw new Error('Token de acesso não informado')

        const { user, permissions } = await AuthenticationService.verifyToken(token, models)
        req.user = user
        req.permissions = permissions

        const allowed = (path, permissions) => {
            if (path === '/') return true
            return permissions.filter(permission => req.path === permission.back_url).length > 0
        }

        if (!allowed(req.path, permissions)) {
            throw new Error('Acesso não autorizado')
        } else {
            return next()
        }

    } catch (e) {
        res.status(401).send({
            message: e.message,
            redirect: '/login'
        })
    }
}
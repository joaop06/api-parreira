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
            { path: '/login', method: 'POST' }
        ]

        // Verifica se o acesso é em algum rota sem Autenticação
        if (noAuth.findIndex(route => route.path === req.path && route.method === req.method) >= 0) {
            return next()
        }

        const { data: user, permissions } = await AuthenticationService.verifyToken(req.headers.authorization || req.query.authorization, models)
        req.user = user
        req.permissions = permissions

        const allowed = (path, operations) => {
            if (path === '/') return true
            return operations.filter(operation => path === operation.back_url).length > 0
        }

        if (!allowed(req.path, permissions)) {
            throw new Error('Not authorized')
        } else {
            return next()
        }

    } catch (e) {
        res.status(401).send({
            message: 'Acesso não autorizado. Tente novamente o login!',
            redirect: '/login'
        })
    }
}
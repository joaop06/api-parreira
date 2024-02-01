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
        ]

        // Verifica se o acesso é em algum rota sem Autenticação
        if (noAuth.findIndex(route => route.path === req.path && route.method === req.method) >= 0) {
            return next()

        } else if (noAuth.findIndex(route => route.path === req.path && route.method !== req.method) >= 0) {
            throw Object.assign(new Error('Method Not Allowed'), { statusCode: 405 })
        }

        const token = req.headers.authorization || req.query.authorization
        if (!token) throw Object.assign(new Error('Token de acesso não informado'), { statusCode: 401, send: { redirect: '/login' } })

        const { user, permissions } = await AuthenticationService.verifyToken(token, models)
        req.user = user
        req.permissions = permissions

        const allowed = (path, permissions) => {
            if (path === '/') return true
            return permissions.filter(permission => req.path === permission.back_url).length > 0
        }

        if (!allowed(req.path, permissions) && user.group_id !== 1) {
            throw Object.assign(new Error('Acesso não autorizado'), { statusCode: 401, send: { redirect: '/login' } })
        } else {
            return next()
        }

    } catch (e) {
        return next(e)
    }
}
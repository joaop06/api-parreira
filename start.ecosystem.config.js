module.exports = {
    apps: [{
        name: 'backend',
        script: 'app.js',
        time: true,
        exec_mode: "cluster",
        instances: 2,
        autorestart: true,
        loglevel: "info"
    }]
}

module.exports = {
    apps: [{
        name: 'backend',
        script: 'app.js',
        time: true,
        // exec_mode: "fork",
        // exec_mode: "cluster",
        instances: 4
    }]
}
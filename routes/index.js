const sideRouter = require('./site');

function route(app) {
    app.use('/', sideRouter)
}

module.exports = route;
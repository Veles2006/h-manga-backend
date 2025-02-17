const sideRouter = require('./site');
const comicRouter = require('./comic')

function route(app) {
    app.use('/comic', comicRouter)
    app.use('/', sideRouter)
}

module.exports = route;
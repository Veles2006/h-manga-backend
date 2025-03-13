const sideRouter = require('./site');
const comicRouter = require('./comic');
const chapterRouter = require('./chapter');
const categoryRouter = require('./category');

function route(app) {
    app.use('/categories', categoryRouter)
    app.use('/comics', comicRouter)
    app.use('/chapters', chapterRouter)
    app.use('/', sideRouter)
}

module.exports = route;
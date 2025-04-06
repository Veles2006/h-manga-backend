import { Application } from 'express';
import sideRouter from './site';
import comicRouter from './comic';
import chapterRouter from './chapter';
import categoryRouter from './category';
import authRouter from './auth'

export default function route(app: Application): void {
    app.use('/categories', categoryRouter);
    app.use('/comics', comicRouter);
    app.use('/chapters', chapterRouter);
    app.use('/auth', authRouter);
    app.use('/', sideRouter);
}
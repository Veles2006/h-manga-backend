import path from 'path';
import express, { Application } from 'express';
import morgan from 'morgan';
import methodOverride from 'method-override';
import { engine as handlebars } from 'express-handlebars';
import cors from 'cors';
import dotenv from 'dotenv';

import route from './routes';
import db from './config/db';


dotenv.config();

const app: Application = express();

// Connect DB
db.connect();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cors());
app.use(morgan('dev'));

// Template engine
app.engine(
    'hbs',
    handlebars({
        extname: 'hbs',
        helpers: {
            sum: (a: number, b: number) => a + b,
        },
    })
);

// Nếu dùng view:
// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'resources', 'views'));

// Init routes
route(app);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, '0.0.0.0', () =>
    console.log(`🚀 Server running on port ${PORT}`)
);

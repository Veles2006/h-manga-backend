const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { engine: handlebars } = require('express-handlebars');
const cors = require('cors');
const app = express();
require('dotenv').config();

const route = require('./routes');
const db = require('./config/db');

db.connect();

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

app.use(methodOverride('_method'));

app.engine(
    'hbs',
    handlebars({
        extname: 'hbs',
        helpers: {
            sum: (a, b) => a + b,
        },
    })
);

// Sử dụng CORS cho tất cả các yêu cầu
app.use(cors());

// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes init
route(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));

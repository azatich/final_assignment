const express = require('express');
const i18next = require('i18next');
const middleware = require('i18next-http-middleware');
const Backend = require('i18next-node-fs-backend');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes/router');
const methodOverride = require('method-override');
require('dotenv').config({path: './.env'});
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
const app = express();
const PORT = process.env.PORT || 80;

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        fallbackLng: 'kz',
        backend: {
            loadPath: __dirname + '/locales/{{lng}}.json',
        },
        detection: {
            lookupSession: 'lang',
        },
    })
    .then(() => {
        console.log('i18next initialized successfully');
    })
    .catch((error) => {
        console.error('Error initializing i18next:', error);
    });
app.use(middleware.handle(i18next));
app.use((req, res, next) => {
    req.session.lang = req.session.lang || 'kz';
    req.i18n.changeLanguage(req.session.lang);
    next();
});

app.use('/', router);
app.use((req, res, next) => {
    res.status(404).render('pages/error_page/error');
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});
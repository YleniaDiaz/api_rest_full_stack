const EXPRESS = require('express');
const SESSION = require('express-session');
const APP = EXPRESS();
const MYSQL_STORE = require('express-mysql-session');

const {DATABASE} = require('./database/db');

APP.set('PORT', process.env.PORT || 8000);

APP.set('PATH_LINKS', `${__dirname}/src/views/links`);
APP.set('PATH_AUTH', `${__dirname}/src/views/auth`);

//para aceptar los datos que vienen de un formulario
APP.use(EXPRESS.urlencoded({extended:true}));

const HANDLEBARS=require('express-handlebars');

//APP.set('views', './src/views');
APP.engine('.hbs', HANDLEBARS({
    defaultLayout: 'main',
    layoutsDir: ('./src/views/main'),
    partialsDir:('./src/views/main/partials'),
    extname: '.hbs'
}));
APP.set('view engine','.hbs');

APP.use(SESSION({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store:new MYSQL_STORE(DATABASE)
}));

APP.use(EXPRESS.json());

APP.use(require('./src/routes/routes'));
APP.use(require('./src/routes/authentications'));

APP.listen(APP.get('PORT'), ()=>console.log(`SERVER LISTENING IN PORT ${APP.get('PORT')}`));
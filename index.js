const EXPRESS = require('express');

const APP = EXPRESS();

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

APP.use(EXPRESS.json());

APP.use(require('./src/routes/routes'));
APP.use(require('./src/routes/authentications'));

APP.listen(APP.get('PORT'), ()=>console.log(`SERVER LISTENING IN PORT ${APP.get('PORT')}`));
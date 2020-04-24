const EXPRESS = require('express');

const APP = EXPRESS();

APP.set('PORT', process.env.PORT || 8000);

APP.set('PATH_LINKS', `${__dirname}/src/views/links`);

const HANDLEBARS=require('express-handlebars');

//APP.set('views', './src/views');
APP.engine('.hbs', HANDLEBARS({
    defaultLayout: 'main',
    layoutsDir: ('./src/views/main'),
    extname: '.hbs'
}));
APP.set('view engine','.hbs');

APP.use(EXPRESS.json());

APP.use(require('./src/routes/routes'));

//para aceptar los datos que vienen de un formulario
APP.use(EXPRESS.urlencoded({extended:false}));

APP.listen(APP.get('PORT'), ()=>console.log(`SERVER LISTENING IN PORT ${APP.get('PORT')}`));
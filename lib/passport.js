const ENCRYPT = require('./encrypt.js');
const PASSPORT=require('passport');
const LOCAL_STRATEGY = require('passport-local').Strategy;
const GOOGLE_STRATEGY=require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID='157183654978-smj11fij5l1lg89dr7huupluo80tuu0r.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET='Jeea3QCHo3ST7mnW0gJFTnTM';
const User = require('../src/models/user');

const POOL = require('../database/db_pool');

PASSPORT.serializeUser((user,done)=>{
    console.log('serializeUser');
    console.log('SERIALIZE_USER', user);
    done(null, user.id);
});

PASSPORT.deserializeUser(async (id, done)=>{
    console.log('deserializeUser');

    const query = await User.findAll({ where: { id: id } })
        .catch(err => console.log(`ERROR deserializeUser -> ${err}`));

    const userString = JSON.stringify(query);
    const LINKS = JSON.parse(userString);

    done(null, LINKS[0]);
});

PASSPORT.use('signupLocal', new LOCAL_STRATEGY({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done)=>{
    //const DATA = await POOL.query(`select username from users where username = '${username}'`);

    const query = User.findAll(
        {attributes: ['username']},
        { where: { username: username }})
    .then(console.log('FIND ALL OK'))
    .catch(err => console.log(`ERROR deserializeUser -> ${err}`));

    const userString = JSON.stringify(query);
    const DATA = JSON.parse(userString);

    if(DATA.length>0){
        //USERNAME ALREDY EXISTS
        const myMessage=JSON.stringify({
            type: 'alert-danger',
            title: 'ERROR',
            info: `El usuario '${username}' ya existe`
        });
        return done(null, false, {message: myMessage});
    }else{
        //USERNAME DOESN'T EXISTS
        const {fullname} = req.body;
        const NEW_PASSWORD= await ENCRYPT.encryptPassword(password);
        //const LINKS = await POOL.query(`insert into users (fullname, username, password) values ('${fullname}', '${username}', '${NEW_PASSWORD}')`);
        
        const query = await User.create({username: username, password: NEW_PASSWORD, fullname: fullname})
            .catch(err => console.log(`ERROR CREATE USER PASSPORT -> ${err}`));

        const userString = JSON.stringify(query);
        const LINKS = JSON.parse(userString);

        const id=query.dataValues.id;
        const NEW_USER={
            id, username, password, fullname
        }

        const myMessage=JSON.stringify({
            type: 'alert-success',
            title: 'OK',
            info: 'Te has registrado correctamente'
        });

        return done(null, NEW_USER, {message: myMessage});
    }
}));

PASSPORT.use('signinLocal', new LOCAL_STRATEGY({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done)=>{
    const query = await User.findAll(
        { where: { username: username }})
    .catch(err => console.log(`ERROR deserializeUser -> ${err}`));

    const userString = JSON.stringify(query);
    const SELECT = JSON.parse(userString);

    if(SELECT.length>0){
        //USERNAME EXISTS
        const IS_VALID = await ENCRYPT.comparePassword(password, SELECT[0].password);
        if(IS_VALID){
            //PASSWORD IS VALID
            req.session.loggedin=true;
            req.session.username=username;
            const {id, fullname} = SELECT[0];
            const NEW_USER={
                id, username, password, fullname
            }

            const myMessage=JSON.stringify({
                type: 'alert-success',
                title: 'BIENVENIDO',
                info: username
            });

            return done(null, NEW_USER, {message: myMessage});
        }else{
            //INCORRECT PASSWORD
            const myMessage=JSON.stringify({
                type: 'alert-danger',
                title: 'ERROR',
                info: 'Contraseña incorrecta'
            });

            return done(null, false, {message: myMessage});
        }
    }else{
        //USER DOESN'T EXISTS
        const myMessage=JSON.stringify({
            type: 'alert-danger',
            title: 'ERROR',
            info: `El usuario '${username}' no existe`
        });

        return done(null, false, {message: myMessage});
    }
}));

/**
 * GOOGLE AUTH
 */
PASSPORT.use('googleAuth', new GOOGLE_STRATEGY({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8000/googleauth/callback',
    passReqToCallback: true // Importante para poder usar la variable de sesión

}, async(req, accessToken, refreshToken, profile, done) => {
    //const user = await POOL.query(`SELECT * FROM users WHERE username = '${profile.emails[0].value}'`);

    const query = await User.findAll(
        { where: { username: profile.emails[0].value }})
    .catch(err => console.log(`ERROR deserializeUser -> ${err}`));

    const userString = JSON.stringify(query);
    const user = JSON.parse(userString);

    const googleUser = {
        id: profile.id,
        email: profile.emails[0].value,
        username: profile.username,
        name: profile.displayName
    };
    
    if (user.length < 0) {
        //await POOL.query(`INSERT INTO users (username, fullname) VALUES ('${googleUser.email}', '${googleUser.name}')`);
        await User.create({username: googleUser.email,  fullname: googleUser.name})
            .catch(err => console.log(`ERROR CREATE USER PASSPORT -> ${err}`));
    }

    req.session.loggedin = true;
    req.session.username = googleUser.name;

    return done(null, googleUser);
}));

module.exports=PASSPORT;
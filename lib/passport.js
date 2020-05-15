const EXPRESS = require('express');
const POOL = require('../database/db_pool');
const ENCRYPT = require('./encrypt.js');
const PASSPORT=require('passport');
const LOCAL_STRATEGY = require('passport-local').Strategy;
const GOOGLE_STRATEGY=require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID='157183654978-smj11fij5l1lg89dr7huupluo80tuu0r.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET='Jeea3QCHo3ST7mnW0gJFTnTM';

PASSPORT.serializeUser((user,done)=>{
    console.log('serializeUser');
    console.log(user);
    done(null, user.id);
});

PASSPORT.deserializeUser(async (id, done)=>{
    console.log('deserializeUser');
    const LINKS=await POOL.query(`SELECT * FROM users where id=${id}`);
    done(null, LINKS[0]);
});

PASSPORT.use('signupLocal', new LOCAL_STRATEGY({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done)=>{
    if(password==null) return done(null, false);

    const DATA = await POOL.query(`select username from users where username = '${username}'`);
    if(DATA.length>0){
        return done(null, false);
    }else{
        const {fullname} = req.body;
        const NEW_PASSWORD= await ENCRYPT.encryptPassword(password);
        const LINKS = await POOL.query(`insert into users (fullname, username, password) values ('${fullname}', '${username}', '${NEW_PASSWORD}')`);
        const id=LINKS.insertId;
        const NEW_USER={
            id, username, password, fullname
        }
        return done(null, NEW_USER);
    }
}));

PASSPORT.use('signinLocal', new LOCAL_STRATEGY({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done)=>{
    if(password==null) return done(null, false, req.flash('loginMessage', 'PASSWORD NULL'));

    const QUERY = `select * from users where username='${username}'`;
    const SELECT=await POOL.query(QUERY);  //devuelve un array con las contraseñas

    if(SELECT.length>0){
        const IS_VALID = await ENCRYPT.comparePassword(password, SELECT[0].password);
        if(IS_VALID){
            req.session.loggedin=true;
            req.session.username=username;
            const {id, fullname} = SELECT[0];
            const NEW_USER={
                id, username, password, fullname
            }
            return done(null, NEW_USER);
        }else{
            return done(null, false, req.flash('loginMessage', 'PASSWORD IN VALID'));
        }
    }else{
        return done(null, false, req.flash('loginMessage', 'USER DOEST EXIST'));
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
    const user = await POOL.query(`SELECT * FROM users WHERE username = '${profile.emails[0].value}'`);

    const googleUser = {
        id: profile.id,
        email: profile.emails[0].value,
        username: profile.username,
        name: profile.displayName
    };
    
    if (user.length == 0) {
        await POOL.query(`INSERT INTO users (username, fullname) VALUES ('${googleUser.email}', '${googleUser.name}')`);
    }

    req.session.loggedin = true;
    req.session.username = googleUser.name;

    return done(null, googleUser);
}));

module.exports=PASSPORT;
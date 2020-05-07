/** Passport sólo proporciona el mecanismo para manejar la autenticación, 
 * dejando la responsabilidad de implementar la sesión de manipulación 
 * nosotros mismos y para que vamos a utilizar express-session.  
 */
//serializar y deserializar la instancia de usuario de un almacén de sesiones para poder dar soporte a las sesiones de inicio de sesión
//npm instal passport passport-local
//https://code.tutsplus.com/es/tutorials/authenticating-nodejs-applications-with-passport--cms-21619

const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const POOL = require('../database/db_pool');
const ENCRYPT = require('./encrypt.js');
const PASSPORT=require('passport');
const LOCAL_STRATEGY = require('passport-local').Strategy;

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
    const DATA = await POOL.query(`select username from users where username = '${username}'`);
    if(DATA.length>0){
        return done(null, false);
    }else{
        const {fullname} = req.body;
        const NEW_PASSWORD= await ENCRYPT.encryptPassword(password);
        const LINKS = await POOL.query(`insert into users (fullname, username, password) values ('${fullname}', '${username}', '${NEW_PASSWORD}')`);
        const ID=LINKS.insertId;
        const NEW_USER={
            ID, username, password, fullname
        }
        return done(null, NEW_USER);
    }
}));

PASSPORT.use('signinLocal', new LOCAL_STRATEGY({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done)=>{
    const QUERY = `select password from users where username='${username}'`;
    const ENCRYPT_PASSWORD=await POOL.query(QUERY);  //devuelve un array con las contraseñas

    if(ENCRYPT_PASSWORD.length>0){
        const IS_VALID = await ENCRYPT.comparePassword(password, ENCRYPT_PASSWORD[0].password);
        if(IS_VALID){
            req.session.loggedin=true;
            req.session.username=username;
            const NEW_USER={
                username, password
            }
            return done(null, NEW_USER);
        }else{
            return done(null, false);
        }
    }else{
        return done(null, false);
    }
}));

module.exports=PASSPORT;
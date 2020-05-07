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

module.exports=PASSPORT;
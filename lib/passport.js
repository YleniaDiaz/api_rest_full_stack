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
            return done(null, false);
        }
    }else{
        return done(null, false);
    }
}));

module.exports=PASSPORT;
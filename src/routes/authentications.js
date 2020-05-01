const EXPRESS = require('express');

const ROUTER = EXPRESS.Router();

const POOL = require('../../database/db_pool');

const ENCRYPT = require('../../lib/encrypt.js');

/**
 * SIGN UP
 */
ROUTER.get('/signup', (req, res)=>{
    res.render(`${req.app.get('PATH_AUTH')}/signup`);
});

ROUTER.post('/signup', async(req, res)=>{
    const {fullname, username, password} = req.body;
    const DATA = await POOL.query(`select username from users where username = '${username}'`);
    if(DATA.length>0){
        res.redirect('/signup');
    }else{
        const NEW_PASSWORD= await ENCRYPT.encryptPassword(password);
        await POOL.query(`insert into users (fullname, username, password) values ('${fullname}', '${username}', '${NEW_PASSWORD}')`);
        res.redirect('/signin');
    }
});

/**
 * SIGN IN
 */
ROUTER.get('/signin', (req, res)=>{
    res.render(`${req.app.get('PATH_AUTH')}/signin`);
});

ROUTER.post('/signin', async(req, res)=>{
    const {username, password}=req.body;
    const QUERY = `select password from users where username='${username}'`;
    const ENCRYPT_PASSWORD=await POOL.query(QUERY);

    if(ENCRYPT_PASSWORD.length>0){
        const VALIDATE = await ENCRYPT.comparePassword(password, ENCRYPT_PASSWORD[0].password);
        if(VALIDATE){
            res.redirect('/list');
        }else{
            res.redirect('/signin');
        }
    }else{
        res.redirect('/signin');
    }
});

module.exports=ROUTER;
const EXPRESS = require('express');

const ROUTER = EXPRESS.Router();

const POOL = require('../../database/db_pool');

/**
 * SIGN UP
 */
ROUTER.get('/signup', (req, res)=>{
    res.render(`${req.app.get('PATH_AUTH')}/signup`);
});

ROUTER.post('/signup', async(req, res)=>{
    const {fullname, username, password} = req.body;
    const QUERY=`insert into users (fullname, username, password) values ('${fullname}', '${username}', '${password}')`;
    await POOL.query(QUERY);
    res.redirect('/list');
});

/**
 * SIGN IN
 */
ROUTER.get('/signin', (req, res)=>{
    res.render(`${req.app.get('PATH_AUTH')}/signin`);
});

module.exports=ROUTER;
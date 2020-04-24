const EXPRESS = require('express');

const ROUTER = EXPRESS.Router();

const POOL = require('../../database/db_pool');

ROUTER.get('/', (req, res)=>{
    res.send('Hola Don Pepito');
});

ROUTER.get('/list', async(req, res)=>{
    const LINKS=await POOL.query('SELECT * FROM employees');
    res.render(`${req.app.get('PATH_LINKS')}/list`,{LINKS});
});

module.exports=ROUTER;
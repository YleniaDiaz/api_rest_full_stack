const EXPRESS = require('express');

const ROUTER = EXPRESS.Router();

const POOL = require('../../database/db_pool');

//const PATH=require('path');
//PATH.join(__dirname,'directori');

ROUTER.get('/', (req, res)=>{
    res.send('Hola Don Pepito');
});

ROUTER.get('/list', async(req, res)=>{
    const LINKS=await POOL.query('SELECT * FROM employees');
    //console.log(LINKS);
    //res.send('Aquí irán las listas');
    res.render('../views/links/list',{LINKS});
});

module.exports=ROUTER;
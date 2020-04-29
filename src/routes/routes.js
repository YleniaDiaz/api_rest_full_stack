const EXPRESS = require('express');

const ROUTER = EXPRESS.Router();

const POOL = require('../../database/db_pool');

ROUTER.get('/', (req, res)=>{
    res.send('Hola Don Pepito');
});

/**
 * LIST
 */
ROUTER.get('/list', async(req, res)=>{
    const LINKS=await POOL.query('SELECT * FROM employees');
    res.render(`${req.app.get('PATH_LINKS')}/list`,{LINKS});
});

/**
 * ADD
 */
ROUTER.get('/add', async(req, res)=>{
    res.render(`${req.app.get('PATH_LINKS')}/add`);
});

ROUTER.post('/add', async(req, res)=>{
    const {name, salary}=req.body;
    await POOL.query(`insert into employees (name, salary) values ('${name}', ${salary})`);
    res.redirect('list');
});

/**
 * EDIT
 */
ROUTER.get('/edit/:id', async(req, res)=>{
    const {id} = req.params;
    const LINKS=await POOL.query(`SELECT * FROM employees where id=${id}`);
    //LINKS[0]
    res.render(`${req.app.get('PATH_LINKS')}/edit`, {LINKS});
});

ROUTER.put('/add', async(req, res)=>{
    const {name, salary}=req.body;
    await POOL.query(`insert into employees (name, salary) values ('${name}', ${salary})`);
    res.redirect('list');
});

/**
 * DELETE
 */
ROUTER.get('/delete/:id', async(req, res)=>{
    const {id} = req.params;
    await POOL.query(`delete from employees where id=${id}`);
    res.redirect('/list');
});

module.exports=ROUTER;
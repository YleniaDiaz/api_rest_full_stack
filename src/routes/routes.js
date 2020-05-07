const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const POOL = require('../../database/db_pool');

const IS_LOGGED=(req, res, next)=>{
    if(req.session.loggedin){
        return next();
    }else{
        res.redirect('/signin');
    }
};

ROUTER.get('/', (req, res)=>{
    res.render(`${req.app.get('PATH_LINKS')}/home`);
});

/**
 * LIST
 */
ROUTER.get('/list', IS_LOGGED, async(req, res)=>{
    const LINKS=await POOL.query('SELECT * FROM employees');
    LINKS.username=req.session.username;
    res.render(`${req.app.get('PATH_LINKS')}/list`, {LINKS});
});

/**
 * ADD
 */
ROUTER.get('/add', IS_LOGGED, async(req, res)=>{
    const LINKS={username: req.session.username};
    res.render(`${req.app.get('PATH_LINKS')}/add`, {LINKS});
});

ROUTER.post('/add', IS_LOGGED, async(req, res)=>{
    const {name, salary}=req.body;
    await POOL.query(`insert into employees (name, salary) values ('${name}', ${salary})`);
    res.redirect('list');
});

/**
 * EDIT
 */
ROUTER.get('/edit/:id', IS_LOGGED, async(req, res)=>{
    const {id} = req.params;
    const LINKS=await POOL.query(`SELECT * FROM employees where id=${id}`);
    LINKS[0].username=req.session.username;
    res.render(`${req.app.get('PATH_LINKS')}/edit`, {links:LINKS[0]});
});

ROUTER.post('/edit/:id', IS_LOGGED, async(req, res)=>{
    const {id} = req.params;
    const {name, salary}=req.body;
    const QUERY = `update employees set name='${name}', salary=${salary} where id=${id}`;
    await POOL.query(QUERY);
    res.redirect('/list');
});

/**
 * DELETE
 */
ROUTER.get('/delete/:id', IS_LOGGED, async(req, res)=>{
    const {id} = req.params;
    await POOL.query(`delete from employees where id=${id}`);
    res.redirect('/list');
});

module.exports=ROUTER;
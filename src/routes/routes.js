const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const employeeController = require('../controller/employee-controller');

const IS_LOGGED=(req, res, next)=>{
    if(req.session.loggedin){
        return next();
    }else{
        res.redirect('/signin');
    }
};

ROUTER.get('/', employeeController.home);

/**
 * LIST
 */
ROUTER.get('/list', IS_LOGGED, employeeController.list);

/**
 * ADD
 */
ROUTER.get('/add', IS_LOGGED, employeeController.getAdd);

ROUTER.post('/add', IS_LOGGED, employeeController.postAdd);

/**
 * EDIT
 */
ROUTER.get('/edit/:id', IS_LOGGED, employeeController.getEdit);

ROUTER.post('/edit/:id', IS_LOGGED, employeeController.postEdit);

/**
 * DELETE
 */
ROUTER.get('/delete/:id', IS_LOGGED, employeeController.delete);

module.exports=ROUTER;
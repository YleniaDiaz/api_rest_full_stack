const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const userControler = require('../controller/user-controller');

const IS_LOGGED=(req, res, next)=>{
    if(req.session.loggedin){
        res.redirect('/list');
    }else{
        return next();
    }
};

/**
 * SIGN UP
 */
ROUTER.get('/signup', IS_LOGGED, userControler.getSignUp);

ROUTER.post('/signup', userControler.postSignUp);

/**
 * SIGN IN
 */
ROUTER.get('/signin', IS_LOGGED, userControler.getSignIn);

ROUTER.post('/signin', userControler.postSignIn);

/**
 * GOOGLE AUTH
 */
ROUTER.get('/googleauth', IS_LOGGED, userControler.googleGet);

ROUTER.get('/googleauth/callback', userControler.googleCallback);

/**
 * SIGN OUT
 */
ROUTER.get('/signout', userControler.signOut);

module.exports=ROUTER;
const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const PASSPORT = require('../../lib/passport');

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
ROUTER.get('/signup', IS_LOGGED, (req, res)=>{
    res.render(`${req.app.get('PATH_AUTH')}/signup`);
});

ROUTER.post('/signup', PASSPORT.authenticate('signupLocal',{ 
    successRedirect:'/signin',
    failureRedirect: '/signup',
    failureFlash: true
}));

/**
 * SIGN IN
 */
ROUTER.get('/signin', IS_LOGGED, (req, res)=>{
    res.render(`${req.app.get('PATH_AUTH')}/signin`);
});

ROUTER.post('/signin', PASSPORT.authenticate('signinLocal',{
    successRedirect:'/list',
    failureRedirect: '/signin',
    failureFlash: true
}));

/**
 * SIGN OUT
 */
ROUTER.get('/signout', async(req, res)=>{
    req.session.logout;
    req.session.loggedin=false;
    res.redirect('/signin');
});

module.exports=ROUTER;
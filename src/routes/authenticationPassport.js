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

ROUTER.post('/signup', PASSPORT.authenticate('signupLocal', { 
    successRedirect:'/signin',
    failureRedirect: '/signup',
    failureFlash: 'false'
}));

/**
 * SIGN IN
 */
ROUTER.get('/signin', IS_LOGGED, (req, res)=>{
    console.log(req.flash('loginMessage')[0]);
    res.render(`${req.app.get('PATH_AUTH')}/signin`, {message: req.flash('loginMessage')[0]});
});

ROUTER.post('/signin', PASSPORT.authenticate('signinLocal', {
    successRedirect:'/list',
    failureRedirect: '/signin',
    failureFlash: true
}));

/**
 * GOOGLE AUTH
 */
ROUTER.get('/googleauth', IS_LOGGED, PASSPORT.authenticate('googleAuth', {
    scope:['profile', 'email']
}));

ROUTER.get('/googleauth/callback', PASSPORT.authenticate('googleAuth', {
    successRedirect: '/list',
    failureRedirect: '/signin',
    failureFlash: false
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
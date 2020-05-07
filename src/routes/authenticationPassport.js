const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const PASSPORT = require('../../lib/passport');

const IS_LOGGED=(req, res, next)=>{
    if(req.session.loggedin){
        return next();
    }else{
        res.redirect('/list');
    }
};

/**
 * SIGN UP
 */
ROUTER.get('/signup', IS_LOGGED, (req, res)=>{
    res.render(`${req.app.get('PATH_AUTH')}/signup`);
});

ROUTER.post('/signup', PASSPORT.authenticate('signupLocal',{ 
    successRedirect:'/list',
    failureRedirect: '/signup',
    failureFlash: true
}));

/**
 * SIGN IN
 */
/*ROUTER.get('/signin', IS_LOGGED, (req, res)=>{
    res.render(`${req.app.get('PATH_AUTH')}/signin`);
});

ROUTER.post('/signin', IS_LOGGED, async(req, res)=>{
    const {username, password}=req.body;
    const QUERY = `select password from users where username='${username}'`;
    const ENCRYPT_PASSWORD=await POOL.query(QUERY);  //devuelve un array con las contraseñas

    if(ENCRYPT_PASSWORD.length>0){
        const IS_VALID = await ENCRYPT.comparePassword(password, ENCRYPT_PASSWORD[0].password);
        if(IS_VALID){
            req.session.loggedin=true;
            req.session.username=username;
            res.redirect('/list');
        }else{
            res.redirect('/signin');
        }
    }else{
        res.redirect('/signin');
    }
});*/

/**
 * SIGN OUT
 */
/*ROUTER.get('/signout', async(req, res)=>{
    req.session.logout;
    req.session.loggedin=false;
    res.redirect('/signin');
});*/

module.exports=ROUTER;
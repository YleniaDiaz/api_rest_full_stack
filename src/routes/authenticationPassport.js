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
    const FLASH_MESSAGE=req.flash();
    console.log(FLASH_MESSAGE);
    
    if(FLASH_MESSAGE.error!=undefined){
        let myMessage={};

        if(FLASH_MESSAGE.error[0]=='Missing credentials'){
            //EMPTY FIELD
            myMessage={
                type: 'alert-warning',
                title: 'ERROR',
                info: 'No puede haber ningún campo vacío'
            };
        }else{
            //OBJECT MY_MESSAGE FROM PASSPORT
            myMessage=JSON.parse((FLASH_MESSAGE.error));
        }

        res.locals.myAlert=myMessage;
    }

    res.render(`${req.app.get('PATH_AUTH')}/signup`);
});

ROUTER.post('/signup', PASSPORT.authenticate('signupLocal', { 
    successRedirect:'/signin',
    failureRedirect: '/signup',
    failureFlash: true,
    successFlash: true
}));

/**
 * SIGN IN
 */
ROUTER.get('/signin', IS_LOGGED, (req, res)=>{
    const FLASH_MESSAGE=req.flash();
    console.log(FLASH_MESSAGE);

    if(FLASH_MESSAGE.error!=undefined){
        let myMessage={};

        if(FLASH_MESSAGE.error[0]=='Missing credentials'){
            //EMPTY FIELD
            myMessage={
                type: 'alert-warning',
                title: 'ERROR',
                info: 'No puede haber ningún campo vacío'
            };
        }else{
            //OBJECT MY_MESSAGE FROM PASSPORT
            myMessage=JSON.parse((FLASH_MESSAGE.error));
        }

        res.locals.myAlert=myMessage;
    }
    
    if(FLASH_MESSAGE.success!=undefined){
        //OBJECT MY_MESSAGE FROM PASSPORT
        myMessage=JSON.parse((FLASH_MESSAGE.success));
        res.locals.myAlert=myMessage;
    }

    res.render(`${req.app.get('PATH_AUTH')}/signin`);
});

ROUTER.post('/signin', PASSPORT.authenticate('signinLocal', {
    successRedirect:'/list',
    failureRedirect: '/signin',
    failureFlash: true,
    successFlash: true
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
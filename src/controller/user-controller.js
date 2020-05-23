const PASSPORT = require('../../lib/passport');

const controller = {};

controller.getSignUp=(req, res)=>{
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
}

controller.postSignUp=PASSPORT.authenticate('signupLocal', { 
    successRedirect:'/signin',
    failureRedirect: '/signup',
    failureFlash: true,
    successFlash: true
});

controller.getSignIn=(req, res)=>{
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
}

controller.postSignIn= PASSPORT.authenticate('signinLocal', {
    successRedirect:'/list',
    failureRedirect: '/signin',
    failureFlash: true,
    successFlash: true
});

controller.googleGet=PASSPORT.authenticate('googleAuth', {
    scope:['profile', 'email']
});

controller.googleCallback=PASSPORT.authenticate('googleAuth', {
    successRedirect: '/list',
    failureRedirect: '/signin',
    failureFlash: false
});

controller.signOut=async(req, res)=>{
    req.session.logout;
    req.session.loggedin=false;
    res.redirect('/signin');
}

module.exports=controller;
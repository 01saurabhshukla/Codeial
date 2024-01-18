
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');



// authenticate using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
},
    function(req, email,password,done){
        User.findOne({email: email}, function(err, user){

            // findin
            if(err){
                req.flash('error',err);
                return done(err);
            }

            if(!user || user.password != password){
                req.flash('error','invalid Username/Password');
                return done(null,false);
            }

            return done(null, user);


        });
    }
));


// serializing the user to decide which key is to kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});


// deserializing the user from the key in cookies
passport.deserializeUser(function(id, done){
    User.findById(id,function(err,user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    });
});


// Check whether user is authenticated or not
passport.checkAuthentication = function(req, res, next){
    // if user is authenticated 
    if(req.isAuthenticated()){
       return next();
    }

    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){

    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie
        //  and we are just sending to the locals to the views
        res.locals.user  = req.user;
    }

    next();
}


module.exports = passport;
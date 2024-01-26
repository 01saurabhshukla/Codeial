const User = require("../models/user");
const fs = require('fs');
const path = require('path');

module.exports.profile = function (req, res) {
  User.findById(req.params.id, function(err, user){
    return res.render("user_profile", {
      title: "Profile",
      profile_user: user
    });
  });
};


module.exports.update = async function(req, res){
  // anyone can inspect page and can check the user id and can also change anyone user id 
  if(req.user.id == req.params.id){

    try {
      
      let user = await User.findById(req.params.id);
      // now we will not be able to access data directly from req.params.id because 
      // it is now a multipart form and our body parser won't be able to parse it
      User.upLoadedAvatar(req, res, function(err){
        if(err) {console.log('**********MUlTER ERROR: ' , err)}

        user.name = req.body.name;
        user.email = req.body.email;

        if(req.file){

          if(user.avatar){
            // fs.unlinkSync(path.join(__dirname, '..' , user.avatar));

            const oldAvatarPath = path.join(__dirname, '..', user.avatar);
            
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            } else {
                console.log('Old avatar file does not exist:', oldAvatarPath);
            }


          }
          // this is like saving avatar path in User schema base
          user.avatar = User.avatarPath + '/' + req.file.filename;
        }

        user.save();
        return res.redirect('back');

      })


    } catch (err) {

      req.flash('error',err);
      return res.redirect('back');
      
    }
  }
  else{
    return res.status(401).send('Unauthorized');
  }
}

// Render the sign up page
module.exports.signUp = function (req, res) {

  if(req.isAuthenticated()){
    return res.redirect('/users/profile'); 
  }

  return res.render("user_sign_up", {
    title: "Codiel | Sign Up",
  });
};

// Render the sign in page
module.exports.signIn = function (req, res) {

  if(req.isAuthenticated()){
    return res.redirect('/users/profile'); 
  }

  return res.render("user_sign_in", {
    title: "Codiel | Sign In",
  });
};

// To Get The signUp data
// Actually this is a callback function called after route but it
// is now laced in separate folder to be called
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("There is error in finding user in sign up");
      return res.redirect("back");
    }

    if (!user) {
      User.create(req.body, function (err) {
        if (err) {
          console.log("There is error in creating user in sign up");
          return res.redirect("back");
        }

        res.redirect("/users/sign-in");
      });
    } else {
      return res.redirect("back");
    }
  });
};

module.exports.createSession = function (req, res) {
  req.flash('success','Logged in Succesfully');
  return res.redirect('/');
};


module.exports.destroySession = function(req, res){
  req.logout(function(err){
    if(err){console.log('Error in logging out controller');}
  });
  req.flash('success','Logged Out');
  return res.redirect('/');
}

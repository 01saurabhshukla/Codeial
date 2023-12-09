const User = require("../models/user");

module.exports.profile = function (req, res) {
  return res.render("user_profile", {
    title: "Profile",
  });
};

// Render the sign up page
module.exports.signUp = function (req, res) {
  return res.render("user_sign_up", {
    title: "Codiel | Sign Up",
  });
};

// Render the sign in page
module.exports.signIn = function (req, res) {
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
  // TO DO Later
};

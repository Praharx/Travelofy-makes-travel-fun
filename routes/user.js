const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware.js");

const userController = require("../controllers/user.js");


router.route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signUp)); 


router.route("/login")
  .get( userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login);

//Logout route
router.get("/logout", userController.logout);

module.exports = router;

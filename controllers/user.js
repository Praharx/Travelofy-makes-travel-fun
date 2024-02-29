const User = require("../models/user.js");

module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req,res,next)=>{
    try{
        let {email,username,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
           if(err){
             next(err);
           }
           req.flash("success",`Welcome to Travelofy!!! ${username}`);
           res.redirect("/listings");
        })

    } catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/loginuser.ejs");
}

module.exports.login = async (req,res)=>{
    req.flash("success","Welcome back to Wanderlust!!You're logged in!!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You have Logged Out!!");
        res.redirect("/listings");
    })
}
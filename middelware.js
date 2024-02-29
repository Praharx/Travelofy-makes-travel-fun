const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirectUrl save
        req.session.redirectUrl = req.originalUrl;

        req.flash("error","You must be logged in to create a new listing");
        res.redirect("/login");
   }
   next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    console.log(listing.owner, "::::", res.locals.currUser);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You're not the Owner of this listing!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    console.log(review.author, ":::::", res.locals.currUser);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You're not the Owner of this Review!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
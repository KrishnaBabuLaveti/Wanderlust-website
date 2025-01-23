const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        //har info session me store hochuka he, irrespective of the page wee are in...
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You have to Login first!");
        res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error" , "You are not the owner of the listing !");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next) => {
    const {error} = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }
};

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }
  }
//modify routes in express

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js");

//Show All Listings
router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route
router.get("/new" ,isLoggedIn, (req,res) => {
    res.render("listings/new.ejs");
});

//Show route
router.get("/:id" , wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing) {
      req.flash("error" , "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs" , { listing });
}));

//Create Route
router.post("/",isLoggedIn,validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success" , "New Listing Created!");
  res.redirect("/listings");
}));

//edit route
router.get("/:id/edit" ,isLoggedIn,isOwner, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error" , "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs" , { listing });
}));

  //update route
  router.put("/:id" ,isLoggedIn, isOwner,validateListing, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  }));

  //delete route
  router.delete("/:id" ,isLoggedIn, isOwner, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!"); 
    res.redirect("/listings");
  }));


module.exports = router;
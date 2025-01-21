const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

main()
.then(()=>{
    console.log("db is connected");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"./public")));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);





//home route
app.get("/",(req,res)=>{
  res.send("hi");
}
);

app.use("/listings", listings);
app.use("/listings/:id/reviews" , reviews);

// app.get("/testListing",async (req,res)=>{
//     let samplelisting= new Listing({
//      title: "My New Villa",
//      description: "By the beach",
//      price: 10000,
//      location: "Calangute, Goa",
//      country: "Inda",
//     });
//     await samplelisting.save();
//     console.log("sample is saved");
//     res.send("successful saved")

// });

app.all("*" ,(req,res,next) => {
  next(new ExpressError(404,"Page Not Found!"));
  } 
);

app.use((err,req,res,next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs" , {message});
    //res.status(statusCode).send(message);
});


app.listen(8080,()=>{
    console.log("app is listening to requests");
});
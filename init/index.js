const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB: ", err);
})

async function main() {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust", {
        serverSelectionTimeoutMS: 30000,
      });
      console.log("Connected to MongoDB");
    } catch (err) {
      console.log("Error connecting to MongoDB: ", err);
    }
  }


const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initilized");
}

initDB();
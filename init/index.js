const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main().then(()=>{
    console.log("Connection is successful.")
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/travelofy');
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner:'65cdfb5ef8ed39b39b4c9b02'}))
    await Listing.insertMany(initdata.data);
    console.log("data was intialized.")
}

initDB();
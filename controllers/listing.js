const Listing = require("../models/listing");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/newlisting.ejs");
}

module.exports.createNewListing = async (req,res,next)=>{
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location ,
        limit: 1,
    })
    .send();

    let {path:url, filename} = req.file;
    console.log(url ,"....." ,filename);

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;


    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing Created!!!")
    res.redirect("/listings"); 
}

module.exports.renderListing = async (req, res) => {
    let { id } = req.params;
    let foundList = await Listing.findById(id)
         .populate({path:"reviews",
                   populate:{
                        path:"author",
                   }})
         .populate("owner");
    if (!foundList) {
         req.flash("error", "Listing you requested for doesn't exist!!");
         res.redirect("/listings");
    }
    res.render("listings/show.ejs", { foundList });
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
       req.flash("error","Listing you requested for doesn't exist!!");
       res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_200,w_200")
    res.render("listings/update.ejs",{listing, originalImageUrl});
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let change = await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});

    if(typeof req.file !== "undefined"){
        let { path: url, filename } = req.file;
        change.image = { url, filename };
        await change.save();
    }
    console.log(change);
    req.flash("success","Listing Updated!!!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!!!")
    res.redirect("/listings");
}
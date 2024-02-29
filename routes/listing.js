const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const {isLoggedIn ,isOwner} = require("../middelware.js");
const {validateListing} = require("../middelware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router
    .route("/")
    .get( wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createNewListing));
    


//NewListing form route
router.get("/new",
    isLoggedIn,
    listingController.renderNewForm);

router
    .route("/:id")
    .get( wrapAsync(listingController.renderListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListing));


//edit form route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));

module.exports = router;
 

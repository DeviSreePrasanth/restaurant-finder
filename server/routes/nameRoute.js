const express = require("express");
const router = express.Router();
const { getRestaurantByName } = require("../controller/namesearch"); 

router.get("/", getRestaurantByName);

module.exports = router;
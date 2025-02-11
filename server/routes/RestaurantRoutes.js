const express = require("express");
const router = express.Router();

const allrestaurants = require('../controller/restaurantlist');
router.get("/", allrestaurants);

module.exports = router;

const express = require("express");
const { getRestaurants } = require("../controller/RestaurantController");

const router = express.Router();

router.get("/", getRestaurants);

module.exports = router;

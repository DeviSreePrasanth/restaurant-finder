const express = require("express");
const { getRestaurantById } = require("../controller/SearchController");

const router = express.Router();

router.get("/:id", getRestaurantById);

module.exports = router;
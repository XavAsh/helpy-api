const express = require("express");
const { getServices } = require("../controllers/serviceController");
const router = express.Router();

router.get("/services", getServices);

router.export = router;

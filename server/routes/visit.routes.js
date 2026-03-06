const express = require("express");
const router = express.Router();
const visitController = require("../controllers/visit.controller");

// Authentication/Visit routes
router.post("/create", visitController.createVisit);
router.get("/", visitController.getAllVisits);
router.get("/:id", visitController.getSingleVisit);
router.post("/add-visit/:userId", visitController.addVisitToUser);
router.delete("/:id", visitController.deleteVisit);

module.exports = router;

// Develop a sightings router to handle API requests into /sightings

const express = require("express");
const router = express.Router();

class SightingsRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    // Sightings
    router.get("/", this.controller.getAll);
    router.get("/:sightingId", this.controller.getOne);
    router.post("/", this.controller.createOne);
    router.put("/:sightingId", this.controller.editOne);

    return router;
  }
}

module.exports = SightingsRouter;

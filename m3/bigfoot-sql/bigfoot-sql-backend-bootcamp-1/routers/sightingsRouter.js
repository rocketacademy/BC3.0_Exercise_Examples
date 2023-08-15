const express = require("express");
const router = express.Router();

class SightingsRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    // we will insert routes into here later on
    router.get("/", this.controller.getAll);
    router.get("/:sightingId", this.controller.getOne);
    router.post("/", this.controller.createOne);
    router.post("/:sightingId/comment", this.controller.createComment);
    router.put("/:sightingId", this.controller.editOne);

    return router;
  }
}

module.exports = SightingsRouter;

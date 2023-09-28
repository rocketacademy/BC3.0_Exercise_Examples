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
    router.post("/like/:sightingId", this.controller.likeOne);
    router.get("/like/:sightingId", this.controller.getLikes);
    router.put("/:sightingId", this.controller.editOne);
    router.post("/:sightingId/comments", this.controller.createComment);
    router.delete("/:commentId/comments", this.controller.deleteComment);
    router.put("/:commentId/comments", this.controller.editComment);

    return router;
  }
}

module.exports = SightingsRouter;

// Develop a sightings router to handle API requests into /sightings
const express = require("express");
const router = express.Router();

class SightingsRouter {
  constructor(controller, categoryController) {
    this.controller = controller;
    this.categoriesController = categoryController;
  }
  routes() {
    // Sightings
    router.get("/", this.controller.getAll);
    router.get("/:sightingId", this.controller.getOne);
    router.post("/", this.controller.createOne);
    router.put("/:sightingId", this.controller.editOne);
    // Likes
    router.post("/like/:sightingId", this.controller.likeOne);
    router.get("/like/:sightingId", this.controller.getLikes);
    // Comments
    router.post("/:sightingId/comments", this.controller.createComment);
    router.delete("/:commentId/comments", this.controller.deleteComment);
    router.put("/:commentId/comments", this.controller.editComment);

    return router;
  }
}

module.exports = SightingsRouter;

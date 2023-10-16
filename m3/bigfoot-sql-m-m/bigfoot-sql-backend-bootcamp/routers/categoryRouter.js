// Develop a categories router to handle API requests into /categories

const express = require("express");
const router = express.Router();

class CategoryRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll);
    router.post("/", this.controller.newCategory);
    router.post("/:id", this.controller.addCategory);
    router.put("/:id", this.controller.editCategory);

    return router;
  }
}

module.exports = CategoryRouter;

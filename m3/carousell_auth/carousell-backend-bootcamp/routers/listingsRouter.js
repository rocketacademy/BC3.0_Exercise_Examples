// Router to handle the /listings route
const express = require("express");
const router = express.Router();

class ListingsRouter {
  constructor(controller, auth) {
    this.controller = controller;
    this.auth = auth;
  }
  routes() {
    router.get("/", this.controller.getAll.bind(this.controller));
    router.post(
      "/",
      this.auth,
      this.controller.insertOne.bind(this.controller)
    );
    router.get("/:listingId", this.controller.getOne.bind(this.controller));
    router.put(
      "/:listingId/buy",
      this.auth,
      this.controller.buyItem.bind(this.controller)
    );
    return router;
  }
}

module.exports = ListingsRouter;

const cors = require("cors");
const express = require("express");
require("dotenv").config();

// importing Routers
const SightingsRouter = require("./routers/sightingsRouter");
const CategoryRouter = require("./routers/categoryRouter");

// importing Controllers
const SightingsController = require("./controllers/sightingsController");
const CategoryController = require("./controllers/categoryController");

// importing DB
const db = require("./db/models/index");
const { sighting, comment, like, category, sighting_category } = db;

// initializing Controllers -> note the lowercase for the first word
const sightingsController = new SightingsController(
  sighting,
  comment,
  like,
  category
);

const categoryController = new CategoryController(category, sighting_category);

// inittializing Routers
const sightingRouter = new SightingsRouter(sightingsController).routes();
const categoryRouter = new CategoryRouter(categoryController).routes();

const PORT = process.env.PORT;
const app = express();

// Enable CORS access to this server
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// using the routers
app.use("/sightings", sightingRouter);
app.use("/categories", categoryRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});

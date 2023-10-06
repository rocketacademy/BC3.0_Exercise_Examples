const express = require("express");
const { getSightings } = require("./utils.js");
require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT;
const app = express();

// set up cors middleware to allow communication between backend and frontend
app.use(cors());

// setup route handle for http://localhost:3001/sightings
app.get("/sightings", async (req, res) => {
  const sightings = await getSightings();
  //  Send back all sightings
  res.json(sightings);
});

// setup route handle for  eg: http://localhost:3001/sightings/1
app.get("/sighting/:sightingIndex", async (req, res) => {
  // Get the sightingIndex that we are targetting
  const sightingIndex = req.params.sightingIndex;
  const sightings = await getSightings();
  // send back only the targetted sighting from sightings array
  const sighting = sightings[sightingIndex];
  res.json(sighting);
});

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});

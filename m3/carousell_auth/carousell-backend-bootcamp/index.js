const cors = require("cors");
const express = require("express");
const { auth } = require("express-oauth2-jwt-bearer");

require("dotenv").config();

// importing Routers
const ListingsRouter = require("./routers/listingsRouter");

// importing Controllers
const ListingsController = require("./controllers/listingsController");

// importing DB
const db = require("./db/models/index");
const { listing, user } = db;

const PORT = process.env.PORT;
const app = express();

// Enable CORS access to this server
app.use(cors());
// app.use(auth());
// Enable reading JSON request bodies
app.use(express.json());

console.log(process.env);

const checkJwt = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER,
});

// initializing Controllers -> note the lowercase for the first word
const listingsController = new ListingsController(listing, user);

// inittializing Routers
const listingsRouter = new ListingsRouter(
  listingsController,
  checkJwt
).routes();

// enable and use router
app.use("/listings", listingsRouter);
// app.get("/api/private", checkJwt, (req, res) => {
//   res.json({ message: `Hello ${req.auth.payload.sub}` });
// });

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});

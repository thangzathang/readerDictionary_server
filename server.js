// Server Imports
const express = require("express");
const dotenv = require("dotenv");
// Enable .env

// Handle Cors
dotenv.config();

const allowedOrigins = [
  //
  "http://localhost:3000",
  process.env.FRONT_END_NETLIFY_URL,
];
const corsOptions = {
  origin: (origin, callback) => {
    /* 
    -1 means does not exist, but here we are checking !== so in context 
     we are making sure the domain exists in the whitelist 
     */
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Domain not in the whitelist. Not allowed by CORS origin."));
    }
  },
  optionSuccessStatus: 200,
  credentials: true,
};
const cors = require("cors");

// Serapapi
const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(process.env.SERPAPI_ACCESS_KEY);

// Init App
const app = express();
// Enable express
app.use(express.json());
// Enable Cors
app.use(cors(corsOptions));

// PORT config
const PORT = process.env.PORT || 5002;

// To show something to the user
app.get("/", (req, res) => {
  res.send("This is the Pictionary API application!");
});

app.get("/getImage/:term", (req, res) => {
  const queryParameter = req.params.term;
  console.log("queryParameter:", queryParameter);

  const params = {
    q: queryParameter,
    tbm: "isch",
    ijn: "0",
  };

  const callback = function (data) {
    // We return the link of the first image
    let image = data["images_results"][0].original;

    return res.send({ image });
  };

  // Show result as JSON
  search.json(params, callback);
});

// Get Image

/* Error catcher */
app.all("*", (req, res) => {
  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  res.status(404).send(`<h1>Page you are looking for (${fullUrl}) does <em>not</em> exist.</h1>`);
});

app.listen(PORT, () => {
  console.log(`Jaime App Server has started on port ${PORT}.`);
});

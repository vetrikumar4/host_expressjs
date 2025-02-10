const express = require("express");
const router = express.Router();
// Import the DL file to call its function later
const DL = require("./driving_licence");

let { imageUrl1, ID_type, userPrompt, CustomerID } = ""; // Declare variables

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Route handler for /fetch_url
exports.homeRoute = (req, res) => {
  // Extract data from the request body
  imageUrl1 = req.body.imageUrl1;
  ID_type = req.body.ID_type;
  userPrompt = req.body.userPrompt;
  CustomerID = req.body.CustomerID;

  // Log the extracted data
  // console.log(imageUrl1);
  // console.log(ID_type);
  // console.log(userPrompt);
  // console.log(CustomerID);

  // Check if imageUrl1 is provided
  if (!imageUrl1) {
    return res.status(400).json({ error: "Please provide the image URL." });
  }

  // Validate the image URL format using a regular expression
  const imgRegex = /\.(jpeg|jpg|gif|png|bmp|svg)$/i;
  if (!imgRegex.test(imageUrl1)) {
    return res
      .status(400)
      .json({ error: "The provided URL is not a valid image URL." });
  }

  // If validation passes, send a success message
  res.send("Data received successfully");

  // Now call the DL function automatically with the required data
  // Call the function from driving_licence.js to process the data
  DL.processDrivingLicenceData(imageUrl1, ID_type, userPrompt, CustomerID);
};

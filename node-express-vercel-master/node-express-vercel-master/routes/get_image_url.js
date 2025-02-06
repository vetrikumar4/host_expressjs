const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

router.post("/fetch-images", (req, res) => {
  let token = "";

  const url = "https://aura-ai.aurainsure.tech/v1/auth";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const body = new URLSearchParams();
  body.append("client_id", "1234");
  body.append("client_secret", "aura_ai_master");

  fetch(url, {
    method: "POST",
    headers: headers,
    body: body,
  })
    .then((response) => response.json()) // Assuming the response is JSON
    .then((data) => {
      token = data.access_token; // Assuming the token is in the 'token' field in the response
      //   console.log(token); // You can log the token or use it for further actions
    })
    .catch((error) => console.error("Error:", error));
  const { imageUrl1, imageUrl2 } = req.body;

  // Check if both URLs are provided
  if (!imageUrl1 || !imageUrl2) {
    return res.status(400).json({ error: "Please provide both image URLs." });
  }

  // Regular expression to validate image URLs
  const imgRegex = /\.(jpeg|jpg|gif|png|bmp|svg)$/i;

  if (!imgRegex.test(imageUrl1) || !imgRegex.test(imageUrl2)) {
    return res
      .status(400)
      .json({ error: "One or both of the URLs are not valid image URLs." });
  }

  const form = new FormData();

  // Fetch the first image and append it to the form
  axios
    .get(imageUrl1, { responseType: "stream" })
    .then((response1) => {
      form.append("uploaded_files", response1.data, { filename: "image1.jpg" });

      // Fetch the second image and append it to the form
      return axios.get(imageUrl2, { responseType: "stream" });
    })
    .then((response2) => {
      form.append("uploaded_files", response2.data, { filename: "image2.jpg" });

      // Append the user prompt as JSON
      const userPrompt = {
        "ID Number": "int",
        Name: "str",
        "Date of Birth": "datetime",
        Nationality: "str",
        "Issuing Date": "datetime",
        "Expiry Date": "datetime",
        Sex: "str",
        "Card Number": "str",
        Occupation: "str",
        "Employer or Sponsor": "str",
        "Issuing Place": "str",
      };
      form.append("user_prompt", JSON.stringify(userPrompt));

      // Define the API endpoint and Authorization token
      const url =
        "https://aura-ai.aurainsure.tech/v1/sme/?document_name=emirates-id";
      const token1 =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzb21lIjp7ImNsaWVudF9pZCI6MTIzNCwicHJvZHVjdF9pZHMiOls0LDUsNl0sInByb2R1Y3RfbmFtZXMiOlsic21lIiwiaGVhbHRoIiwiYXV0byJdLCJleHAiOjE3Mzg4MjMzMTkuNzY3NjQ4fX0.wRAI7mvViwwm39yXPC1HnJWGrUBi4uu7YYYlyOm2pgk"; // Use the correct token

      // Perform the POST request using axios
      axios
        .post(url, form, {
          headers: {
            ...form.getHeaders(),
            Authorization: "Bearer " + token1,
            Accept: "application/json",
          },
        })
        .then((response) => {
          // Send back the response data from the server
          res.json(response.data);
        })
        .catch((error) => {
          // Handle any errors and send the error back to the client
          console.error("Error:", error);
          res.status(500).json({ error: "Something went wrong" });
        });
    })
    .catch((error) => {
      // Handle errors during image fetch
      console.error("Error fetching images:", error);
      res.status(500).json({ error: "Error fetching image files." });
    });
});

module.exports = router;

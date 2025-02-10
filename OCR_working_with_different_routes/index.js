// Import packages
const express = require("express");
// const home = require("./routes/get_image_url");
const fetch_url = require("./routes/Recieve_URL_and_input_from_user");
const customer = require("./routes/customer_details");

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.get("/check", (req, res) => {
  res.send("working");
});
app.post("/fetch_url", fetch_url.homeRoute);
// app.use("/home", home);

app.use("/customer", customer);

// connection
const port = 3001;
app.listen(port, () => console.log(`Listening to port ${port}`));

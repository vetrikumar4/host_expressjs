// Import packages
const express = require("express");
const home = require("./routes/get_image_url");

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.get("/check", (req, res) => {
  res.send("working");
});
app.use("/home", home);

// connection
const port = 3001;
app.listen(port, () => console.log(`Listening to port ${port}`));

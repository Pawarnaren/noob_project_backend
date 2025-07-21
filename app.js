const express = require("express");
const app = express();
const path = require("path");
const userRoute = require("./routes/userRoute");
const cors = require("cors");
const dotenv = require("dotenv");
const bookRoute = require("./routes/bookRoute");
const favoriteRoute = require("./routes/favoriteRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");

const cron = require("node-cron");
const axios = require("axios");

dotenv.config();
require("./DatabaseConnection/db");

// CORS
app.use(cors());

// Body parser
app.use(express.json());

// Static image route
app.use('./models/img', express.static(path.join(__dirname, './models/img')));

// All routes
app.use("/api/v1", userRoute);
app.use("/api/v1", bookRoute);
app.use("/api/v1", favoriteRoute);
app.use("/api/v1", cartRoute);
app.use("/api/v1", orderRoute);

// ✅ /test route for cron
app.get("/test", (req, res) => {
  res.status(200).send("✅ Tested successfully at " + new Date().toISOString());
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

// ✅ Cron Job to hit /test every 10 seconds
const SERVER_URL = "https://noob-project-backend.onrender.com/test";

cron.schedule("*/10 * * * * *", async () => {
  try {
    const res = await axios.get(SERVER_URL);
    console.log("Pinged /test at", new Date().toISOString(), "- Response:", res.data);
  } catch (err) {
    console.error("Failed to ping /test:", err.message);
  }
});

const express = require("express");
const app = express();
const path = require("path");
const userRoute = require("./routes/userRoute");
const cors = require("cors");
const dotenv = require("dotenv");
const bookRoute = require("./routes/bookRoute");
const favoriteRoute = require("./routes/favoriteRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute= require("./routes/orderRoute");

const cron = require("node-cron");
const axios = require("axios");


dotenv.config();
require("./DatabaseConnection/db");


// Use CORS middleware
app.use(cors());


app.use(express.json());

app.use('./models/img', express.static(path.join(__dirname, './models/img')));

app.use("/api/v1", userRoute);
app.use("/api/v1", bookRoute);
app.use("/api/v1", favoriteRoute);
app.use("/api/v1", cartRoute);
app.use("/api/v1", orderRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});


const SERVER_URL = "https://noob-project-backend.onrender.com/"; // ⚠️ Render ka actual URL daalna

// Cron job to ping the server every 10 seconds
cron.schedule("*/10 * * * * *", async () => {
  try {
    const res = await axios.get(SERVER_URL);
    console.log("Pinged server successfully at", new Date().toISOString());
  } catch (err) {
    console.error("Failed to ping server:", err.message);
  }
});

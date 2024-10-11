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
dotenv.config();
require("./DatabaseConnection/db");



const corsOptions = {
  origin: 'https://bookstore-aditi.netlify.app/',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable this if your frontend needs to send cookies
};
app.use(cors(corsOptions));





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

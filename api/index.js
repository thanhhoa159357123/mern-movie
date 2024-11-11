const express = require("express");
const cors = require("cors"); // Import cors
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/users.js");
const movieRoute = require("./routes/movies.js");
const listRoute = require("./routes/lists.js");

dotenv.config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log("DB Connection Successful!!"))
  .catch((err) => console.log(err));
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});

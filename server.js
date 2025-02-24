require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("DB connected."));

app.use(cors());
app.use(express.json());

const userRouter = require("./routes/users");
app.use("/users", userRouter);

app.listen(3000, () => {
  console.log("Server started.");
})
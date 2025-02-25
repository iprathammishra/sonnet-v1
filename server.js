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

const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);

const userRouter = require("./routes/users");
app.use("/api/users", userRouter);

app.listen(process.env.PORT, () => {
  console.log("Server started.");
})
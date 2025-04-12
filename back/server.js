require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 5000;

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("DB connected."));

app.use(cors());
app.use(express.json());

const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);

const geminiRouter = require("./routes/gemini");
app.use("/api/gem", geminiRouter);

const userRouter = require("./routes/users");
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("Application alive.")
});

app.listen(port, () => {
  console.log("Server started."); 
})



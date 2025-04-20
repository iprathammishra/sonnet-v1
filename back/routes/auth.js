const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, notes: [] });
      await user.save();
    }
    
    res.json({ userId: user._id }); 
  } catch (error) {
    console.error("Error in Google Auth", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/batch", async (req, res) => {
  try {
    const users = req.body; // expecting an array of users
    const createdUsers = [];

    for (const { name, email } of users) {
      let user = await User.findOne({ email });

      if (!user) {
        user = new User({ name, email, notes: [] });
        await user.save();
      }

      createdUsers.push({ userId: user._id, email });
    }

    res.json({ users: createdUsers });
  } catch (error) {
    console.error("Error in batch user creation", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

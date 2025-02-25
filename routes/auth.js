const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const {name, email} = req.body;
    let user = await User.findOne({email});

    if (!user) {
      user = new User({name, email, notes: []});
      await user.save();
    }
    res.json({user});
  } catch (error) {
    console.error("Error in Google Auth", error);
    res.status(500).json({message: "Server error"});
  }
});

module.exports = router;
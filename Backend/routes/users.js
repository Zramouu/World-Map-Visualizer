const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

// Register new User
router.post("/register", async (req, res) => {
    try {
        // Check for existing username
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // Generate new Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create New User
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // Save User and Send a Response 
        const user = await newUser.save();
        res.status(200).json(user._id);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({message: "Username already taken"});
        } else {
            res.status(500).json(error);
        }
    }
});

// Login existing User
router.post("/login", async (req, res) => {
    try {
        // Find User
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json("Wrong username or password!");
        }

        // Validate Password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json('Wrong username or password!');
        }

        // Send response
        res.status(200).json({ _id: user._id, username: user.username });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;

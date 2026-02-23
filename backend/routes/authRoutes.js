// handles register + login
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../models/User');

// 🔧 Helper function - creates a token for the user
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post("/register", async (req, res) => {
    // Get name, email, password from request body
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User already registered" });
        }

        // Hash the password (never save plain password!)
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user in database
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Send back user info + token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token:generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({ message: 'Something went Wrong' });
    }
})


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        // Check if user exists AND password is correct
        if (user && await bcrypt.compare(password, user.password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });

        } else {
            res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
});


module.exports = router;

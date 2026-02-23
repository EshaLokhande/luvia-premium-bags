//handling products
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Product = require('../models/Product')

const { protect, adminOnly } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extreme(file.originalname))
    }
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
})
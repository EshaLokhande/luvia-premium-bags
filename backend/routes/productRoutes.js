//handling products
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path') // Path helps us work with file extensions like .jpg .png
const Product = require('../models/Product')

const { protect, adminOnly } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    // destination - WHERE to save the image
    destination: function (req, res, cb) {
        cb(null, "uploads/"); // save inside uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });// Create upload function using our storage settings



//✅ ROUTE 1 - GET ALL PRODUCTS
// Everyone can see products - no login needed
// URL: GET /api/products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();// Find ALL products from database
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});


//✅ ROUTE 2 - GET SINGLE PRODUCT
// Everyone can see - no login needed
// URL: GET /api/products/abc123
router.get("/:id", async (req, res) => {
    try {
        // req.params.id gets the id from URL
    // example: /api/products/abc123 → id = abc123
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});





// ============================================
// ✅ ROUTE 3 - ADD NEW PRODUCT
// Only admin can add products
// URL: POST /api/products
// protect → checks if logged in
// adminOnly → checks if admin
// upload.single('image') → handles one image upload
router.post("/", protect, adminOnly, upload.single('image'), async (req, res) => {
    try {

        const { name, description, price, category, stock } = req.body;// Get product details from request body

        // Create new product in database
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            image: req.file.path // multer saves image and gives us the path

        })
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
});

// ✅ ROUTE 4 - DELETE PRODUCT
// Only admin can delete products
// URL: DELETE /api/products/abc123
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
            // Find product by id
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        await product.deleteOne();
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
})

module.exports = router;

// Route 1 → GET /api/products         → get ALL products
// Route 2 → GET /api/products/:id     → get ONE product
// Route 3 → POST /api/products        → ADD product (admin)
// Route 4 → DELETE /api/products/:id  → DELETE product (admin)
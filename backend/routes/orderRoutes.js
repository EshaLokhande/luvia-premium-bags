const express = require('express')
const router = express.Router()
const Order = require('../models/Order'); //// Import Order model to talk to orders collection in MongoDB

const { protect, adminOnly } = require('../middleware/authMiddleware')

// ============================================
// ✅ ROUTE 1 - PLACE ORDER
// Only logged in users can place orders
// URL: POST /api/orders
// protect middleware runs first → checks token
// ============================================
router.post('/', protect, async (req, res) => {
    try {
        const { orderItems, shippingAddress, totalPrice } = req.body;
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "No items to order" })
        }
          // Create order in database
    // req.user._id → we get this from protect middleware
    // it automatically knows WHO is placing the order!
        const order = new Order({
            orderItems,
            shippingAddress,
            totalPrice,
            user: req.user._id
        });
        
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});




// ============================================
// ✅ ROUTE 2 - GET MY ORDERS
// Logged in user sees only THEIR orders
// URL: GET /api/orders/myorders
// ============================================
router.get('/myorders', protect, async (req, res) => {
    try {
            // Find orders where user matches logged in user
    // This way user A cannot see user B's orders!

        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' });
    }
});






// ============================================
// ✅ ROUTE 3 - GET SINGLE ORDER
// Logged in user can see details of one order
// URL: GET /api/orders/abc123
// ============================================
router.get('/:id', protect, async (req, res) => {
    try {
          // Find order by id from URL
    // .populate('user', 'name email') means:
    // instead of just showing user's id,
    // go find that user and show their name + email too!
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found!' })
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' });
    }

});




// ============================================
// ✅ ROUTE 4 - GET ALL ORDERS
// Only admin can see ALL orders from ALL users
// URL: GET /api/orders
// protect → checks login first
// adminOnly → then checks if admin
// ============================================
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        // Find ALL orders from ALL users
    // .populate shows user name + email instead of just id
        const orders = await Order.find()
            .populate('user', 'name email')
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' })
    }
});






// ============================================
// ✅ ROUTE 5 - UPDATE ORDER STATUS
// Only admin can update status
// URL: PUT /api/orders/abc123/status
// Status flow: Processing → Shipped → Delivered
// ============================================

router.put('/:id/status', protect, adminOnly, async (req, res) => {
    try {
      // Find the order by id from URL
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found!' })
    }

        
    // Update the status
    // req.body.status comes from admin's request
    // example: { "status": "Shipped" }
    // Admin can change: Processing → Shipped → Delivered
        order.status = req.body.status;

        await order.save();// Save updated order in database

    res.json({ message: 'Order status updated!', order })

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' })
  }
})

module.exports = router;



//MethodWhat it doesExample
// GET Read/fetch dataGet all products
// POST Create new dataPlace new order
// PUT
// Update existing dataUpdate order status
// DELETEDelete dataDelete product
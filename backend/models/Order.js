const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: String,
            image: String,
            price: Number,
            quantity: Number
        }
    ],
    shippingAddress: {
        address: String,
        city: String,
        pincode: String,
        phone: String
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Processing'
    },
    isPaid: {
        type: Boolean,
        deafault: false
    }
}, { timestamp: true });


module.exports = mongoose.model("Order", productSchema);
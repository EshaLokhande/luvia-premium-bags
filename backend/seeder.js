const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Product = require('./models/Product')

dotenv.config()

// Sample products data
const products = [
  {
    name: 'Luvia Noir Tote',
    description: 'Premium black leather tote bag crafted for the modern woman. Spacious and elegant.',
    price: 2999,
    category: 'Tote',
    stock: 10,
    image: 'uploads/bag1.jpg'
    // rename your downloaded image to bag1.jpg
  },
  {
    name: 'Luvia Mini Clutch',
    description: 'Compact and stylish clutch perfect for evenings out. Fits all your essentials.',
    price: 1499,
    category: 'Clutch',
    stock: 15,
    image: 'uploads/bag2.jpg'
  },
  {
    name: 'Luvia Sling Bag',
    description: 'Lightweight sling bag for everyday use. Adjustable strap for comfort.',
    price: 1999,
    category: 'Sling',
    stock: 12,
    image: 'uploads/bag3.jpg'
  },
  {
    name: 'Luvia Shopper',
    description: 'Large shopper bag perfect for work or shopping. Premium leather finish.',
    price: 3499,
    category: 'Shopper',
    stock: 8,
    image: 'uploads/bag4.jpg'
  },
  {
    name: 'Luvia Evening Bag',
    description: 'Elegant evening bag with gold hardware. Perfect for special occasions.',
    price: 2499,
    category: 'Clutch',
    stock: 10,
    image: 'uploads/bag5.jpg'
  },
  {
    name: 'Luvia Crossbody',
    description: 'Stylish crossbody bag with multiple compartments. Perfect for travel.',
    price: 2199,
    category: 'Crossbody',
    stock: 14,
    image: 'uploads/bag6.jpg'
  }
]

// Connect to database and insert products
const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB Connected ✅')

    // Delete all existing products first
    await Product.deleteMany()
    console.log('Old products deleted 🗑️')

    // Insert new products
    await Product.insertMany(products)
    console.log('Products added successfully! 🎉')

    // Disconnect
    mongoose.disconnect()

  } catch (error) {
    console.log('Error:', error)
    mongoose.disconnect()
  }
}

seedProducts();
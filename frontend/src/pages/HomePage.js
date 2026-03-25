import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/cartContext'
import API_URL from '../config'

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true)
    
    const { addToCart } = useCart();// Get addToCart from CartContext

    useEffect(() => {
    // useEffect runs when page loads
  // fetches products from backend
    const fetchProducts = async () => {
      try {
        // const { data } = await axios.get('http://localhost:5000/api/products')
        // Get only first 4 products for homepage
        const { data } = await axios.get(`${API_URL}/api/products`)
        setProducts(data.slice(0, 4))
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])// [] means run only ONCE when page loads

    return (
        <div>

      {/* ==============================
          HERO SECTION
      ============================== */}
      <div className='bg-black text-white min-h-[90vh] flex flex-col items-center justify-center text-center px-4'>

        {/* Small tag above title */}
        <p className='text-gray-400 text-sm tracking-widest mb-4'>
          NEW COLLECTION 2026
        </p>

        {/* Main heading */}
        <h1 className='text-6xl font-bold tracking-widest mb-6'>
          LUVIA
        </h1>

        {/* Subtitle */}
        <p className='text-gray-300 text-lg mb-10 max-w-md'>
          Premium bags crafted for the modern woman.
          Luxury you can carry.
        </p>

        {/* Buttons */}
        <div className='flex gap-4'>
          <Link
            to='/products'
            className='bg-white text-black px-8 py-3 text-sm tracking-widest hover:bg-gray-200 transition'
          >
            SHOP NOW
          </Link>

          <Link
            to='/register'
            className='border border-white text-white px-8 py-3 text-sm tracking-widest hover:bg-white hover:text-black transition'
          >
            JOIN US
          </Link>
        </div>

      </div>

      {/* ==============================
          FEATURED PRODUCTS SECTION
      ============================== */}
      <div className='py-16 px-6 bg-gray-50'>

        {/* Section Title */}
        <h2 className='text-3xl font-bold text-center tracking-widest mb-2'>
          FEATURED
        </h2>
        <p className='text-center text-gray-500 text-sm mb-12'>
          Our most loved pieces
        </p>

        {/* Loading State */}
        {loading ? (
          <p className='text-center text-gray-400'>Loading...</p>
        ) : products.length === 0 ? (
          // No products yet
          <p className='text-center text-gray-400'>
            No products yet. Check back soon!
          </p>
        ) : (
          // Products Grid
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
            {products.map(product => (
              <div
                key={product._id}
                className='bg-white shadow-sm hover:shadow-md transition'
              >
                {/* Product Image */}
                <img
                  // src={`http://localhost:5000/${product.image}`}
                  src={`${API_URL}/${product.image}`}
                  alt={product.name}
                  className='w-full h-64 object-cover'
                />

                {/* Product Info */}
                <div className='p-4'>
                  <h3 className='font-semibold text-sm tracking-wide mb-1'>
                    {product.name}
                  </h3>
                  <p className='text-gray-500 text-xs mb-3'>
                    {product.category}
                  </p>
                  <p className='font-bold mb-4'>
                    ₹{product.price}
                  </p>

                  {/* Buttons */}
                  <div className='flex gap-2'>
                    <Link
                      to={`/products/${product._id}`}
                      className='border border-black text-black text-xs px-3 py-2 hover:bg-black hover:text-white transition flex-1 text-center'
                    >
                      View
                    </Link>
                    <button
                      onClick={() => addToCart(product)}
                      className='bg-black text-white text-xs px-3 py-2 hover:bg-gray-800 transition flex-1'
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className='text-center mt-12'>
          <Link
            to='/products'
            className='border border-black text-black px-8 py-3 text-sm tracking-widest hover:bg-black hover:text-white transition'
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>

      </div>

      {/* ==============================
          FEATURES SECTION
      ============================== */}
      <div className='py-16 px-6 bg-white'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center'>

          <div>
            <p className='text-3xl mb-3'>🚚</p>
            <h3 className='font-bold tracking-wide mb-2'>FREE SHIPPING</h3>
            <p className='text-gray-500 text-sm'>On all orders above ₹2000</p>
          </div>

          <div>
            <p className='text-3xl mb-3'>✨</p>
            <h3 className='font-bold tracking-wide mb-2'>PREMIUM QUALITY</h3>
            <p className='text-gray-500 text-sm'>Handcrafted with finest leather</p>
          </div>

          <div>
            <p className='text-3xl mb-3'>↩️</p>
            <h3 className='font-bold tracking-wide mb-2'>EASY RETURNS</h3>
            <p className='text-gray-500 text-sm'>30 day return policy</p>
          </div>

        </div>
      </div>

      {/* ==============================
          FOOTER
      ============================== */}
      <footer className='bg-black text-white py-8 text-center'>
        <h3 className='tracking-widest font-bold text-xl mb-2'>LUVIA</h3>
        <p className='text-gray-500 text-sm'>© 2026 Luvia. All rights reserved.</p>
      </footer>

    </div>
  )

    

}

export default HomePage
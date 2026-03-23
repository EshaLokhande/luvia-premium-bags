import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/cartContext'

const ProductsPage = () => {

  // Store all products
  const [products, setProducts] = useState([])

  // Loading state
  const [loading, setLoading] = useState(true)

  // Search text
  const [search, setSearch] = useState('')

  // Selected category filter
  const [category, setCategory] = useState('All')

  // Get addToCart from CartContext
  const { addToCart } = useCart()

  // Fetch all products when page loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products')
        setProducts(data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // All categories for filter buttons
  const categories = ['All', 'Tote', 'Clutch', 'Sling', 'Shopper', 'Crossbody']

  // Filter products by search + category
  const filteredProducts = products.filter(product => {

    // Check if product name matches search
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    // Check if product matches selected category
    const matchesCategory = category === 'All' || product.category === category

    // Show product only if BOTH match
    return matchesSearch && matchesCategory
  })

  return (
    <div className='min-h-screen bg-gray-50'>

      {/* ==============================
          HEADER
      ============================== */}
      <div className='bg-black text-white py-16 text-center'>
        <h1 className='text-4xl font-bold tracking-widest mb-2'>
          ALL BAGS
        </h1>
        <p className='text-gray-400 text-sm'>
          {products.length} products
        </p>
      </div>

      <div className='max-w-6xl mx-auto px-6 py-10'>

        {/* ==============================
            SEARCH + FILTER
        ============================== */}
        <div className='flex flex-col md:flex-row gap-4 mb-10'>

          {/* Search Input */}
          <input
            type='text'
            placeholder='Search bags...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='border border-gray-300 px-4 py-2 text-sm w-full md:w-72 focus:outline-none focus:border-black'
          />

          {/* Category Filter Buttons */}
          <div className='flex gap-2 flex-wrap'>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-xs tracking-wide border transition
                  ${category === cat
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-black'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* ==============================
            PRODUCTS GRID
        ============================== */}

        {/* Loading */}
        {loading ? (
          <p className='text-center text-gray-400 py-20'>Loading...</p>

        ) : filteredProducts.length === 0 ? (
          // No products found
          <p className='text-center text-gray-400 py-20'>
            No products found!
          </p>

        ) : (
          // Products Grid
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredProducts.map(product => (
              <div
                key={product._id}
                className='bg-white shadow-sm hover:shadow-md transition'
              >
                {/* Product Image */}
                <img
                  src={`http://localhost:5000/${product.image}`}
                  alt={product.name}
                  className='w-full h-72 object-cover'
                />

                {/* Product Info */}
                <div className='p-5'>

                  {/* Category tag */}
                  <p className='text-xs text-gray-400 tracking-widest mb-1'>
                    {product.category}
                  </p>

                  {/* Name */}
                  <h3 className='font-semibold text-sm tracking-wide mb-1'>
                    {product.name}
                  </h3>

                  {/* Description - only 2 lines */}
                  <p className='text-gray-500 text-xs mb-3 line-clamp-2'>
                    {product.description}
                  </p>

                  {/* Price */}
                  <p className='font-bold text-lg mb-4'>
                    ₹{product.price}
                  </p>

                  {/* Buttons */}
                  <div className='flex gap-2'>
                    <Link
                      to={`/products/${product._id}`}
                      className='border border-black text-black text-xs px-3 py-2 hover:bg-black hover:text-white transition flex-1 text-center'
                    >
                      View Details
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

      </div>
    </div>
  )
}

export default ProductsPage
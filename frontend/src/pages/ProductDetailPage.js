import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/cartContext'
import API_URL from '../config'

const ProductDetailPage = () => {
    const { id } = useParams(); // useParams gets the id from URL
    const [product, setProduct] = useState(null); //single product state
    const [loading, setLoading] = useState(true); //loading state
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false); // to show "Added to cart!" message
    const { addToCart } = useCart();// Get addToCart from CartContext
    const navigate = useNavigate();
    useEffect(() => {
        // Fetch product when page loads
        const fetchProduct = async () => {
            try {
                // const { data } = await axios.get(
                //     `http://localhost:5000/api/products/${id}`
              // )
              const { data } = await axios.get(
  `${API_URL}/api/products/${id}`
)
                setProduct(data);// Save product in state
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false); // always hide loading when done,whether success or error!
            }
        }
        fetchProduct()
    }, [id]);   // [id] means re-fetch if id changes

    // Handle add to cart
  const handleAddToCart = () => {
    // Add product quantity times
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
      setAdded(true);// Show success message
      setTimeout(() => setAdded(false), 2000);// Hide after 2 seconds
    }
    
     // Handle buy now similar to add to cart
  const handleBuyNow = () => {
      handleAddToCart();
      navigate('/cart');
    }
    
    if (loading) {// Show this while fetching product from backend
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-400'>Loading...</p>
      </div>
    )
    }
    

  if (!product) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-400'>Product not found!</p>
      </div>
    )
    }
    
    return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-5xl mx-auto px-6 py-12'>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 bg-white shadow-sm p-8'>

          {/* ==============================
              LEFT - Product Image
          ============================== */}
          <div>
            <img
                // src={`http://localhost:5000/${product.image}`}
                src={`${API_URL}/${product.image}`}
              alt={product.name}
              className='w-full h-96 object-cover'
            />
          </div>

          {/* ==============================
              RIGHT - Product Info
          ============================== */}
          <div className='flex flex-col justify-center'>

            {/* Category */}
            <p className='text-xs text-gray-400 tracking-widest mb-2'>
              {product.category}
            </p>

            {/* Name */}
            <h1 className='text-3xl font-bold tracking-wide mb-4'>
              {product.name}
            </h1>

            {/* Price */}
            <p className='text-2xl font-bold mb-4'>
              ₹{product.price}
            </p>

            {/* Description */}
            <p className='text-gray-500 text-sm leading-relaxed mb-6'>
              {product.description}
            </p>

            {/* Stock */}
            <p className='text-sm mb-6'>
              {product.stock > 0 ? (
                <span className='text-green-600'>
                  ✅ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className='text-red-500'>
                  ❌ Out of Stock
                </span>
              )}
            </p>

            {/* Quantity Selector */}
            <div className='flex items-center gap-4 mb-6'>
              <p className='text-sm text-gray-600'>Quantity:</p>
              <div className='flex items-center border border-gray-300'>
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className='px-3 py-1 hover:bg-gray-100 transition text-lg'
                >
                  -
                </button>
                <span className='px-4 py-1 border-x border-gray-300'>
                  {quantity}
                </span>
                <button
                  onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                  className='px-3 py-1 hover:bg-gray-100 transition text-lg'
                >
                  +
                </button>
              </div>
            </div>

            {/* Success Message */}
            {added && (
              <div className='bg-green-100 text-green-600 text-sm px-4 py-2 mb-4'>
                ✅ Added to cart successfully!
              </div>
            )}

            {/* Buttons */}
            {product.stock > 0 ? (
              <div className='flex gap-3'>
                <button
                  onClick={handleAddToCart}
                  className='border border-black text-black px-6 py-3 text-sm tracking-widest hover:bg-black hover:text-white transition flex-1'
                >
                  ADD TO CART
                </button>
                <button
                  onClick={handleBuyNow}
                  className='bg-black text-white px-6 py-3 text-sm tracking-widest hover:bg-gray-800 transition flex-1'
                >
                  BUY NOW
                </button>
              </div>
            ) : (
              <button
                disabled
                className='bg-gray-300 text-gray-500 px-6 py-3 text-sm tracking-widest w-full cursor-not-allowed'
              >
                OUT OF STOCK
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage

// 🤔 New Things Here!
// useParams:
// javascriptconst { id } = useParams()
// // gets id from URL
// // /products/abc123 → id = "abc123"
// // we use this to fetch the right product!
// setTimeout:
// javascriptsetTimeout(() => setAdded(false), 2000)
// // after 2000ms (2 seconds) → hide success message
// // automatically disappears! 😊
// Quantity selector:
// javascript// - button → decrease (minimum 1)
// quantity > 1 && setQuantity(quantity - 1)

// // + button → increase (maximum = stock)
// quantity < product.stock && setQuantity(quantity + 1)
// leading-relaxed:
// javascript// adds line height to description
// // makes text easier to read! 😊

// Now add route in App.js:
// javascriptimport ProductDetailPage from './pages/ProductDetailPage'

// // inside Routes:
// <Route path='/products/:id' element={<ProductDetailPage />} />

// Go to localhost:3000/products and click View Details on any bag!
// You should see a beautiful product detail page! 😊
// Tell me what you see! 🚀🖤



import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/cartContext'
import { useAuth } from '../context/AuthContext'


// ============================================
// WHAT THIS PAGE DOES:
// Shows all items in cart
// User can increase/decrease quantity
// User can remove items
// User fills shipping address
// User places order → sends to backend
// ============================================



const CartPage = () => {

  // Get everything we need from CartContext
  const {
    cartItems,       // list of products in cart
    removeFromCart,  // remove a product
    increaseQty,     // increase quantity
    decreaseQty,     // decrease quantity
    clearCart,       // empty cart after order
    totalPrice,      // total amount
    totalItems       // total items count
  } = useCart()

  // Get user from AuthContext
  // we need user._id and user.token for order
  const { user } = useAuth()

  // For redirecting after order placed
  const navigate = useNavigate()

  // ============================================
  // SHIPPING ADDRESS STATES
  // User fills these before placing order
  // ============================================
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [phone, setPhone] = useState('')

  // Loading while placing order
  const [loading, setLoading] = useState(false)

  // Error message
  const [error, setError] = useState('')

  // Show order form or not
  const [showForm, setShowForm] = useState(false)

  // ============================================
  // PLACE ORDER FUNCTION
  // Called when user clicks "Place Order"
  // ============================================
  const placeOrder = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      // Build order items array for backend
      // Backend expects: product id, name, image, price, quantity
      const orderItems = cartItems.map(item => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity
      }))

      // Send order to backend
      // Need token in headers because route is protected!
      await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems,
          shippingAddress: { address, city, pincode, phone },
          totalPrice
        },
        {
          // Authorization header with token
          // Backend uses this to know WHO is ordering
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )

      // Order placed successfully!
      clearCart()             // empty the cart
      navigate('/myorders')   // go to my orders page

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // EMPTY CART STATE
  // Show this if cart has no items
  // ============================================
  if (cartItems.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center'>
        <p className='text-6xl mb-6'>🛒</p>
        <h2 className='text-2xl font-bold tracking-widest mb-4'>
          YOUR CART IS EMPTY
        </h2>
        <p className='text-gray-500 text-sm mb-8'>
          Looks like you haven't added anything yet!
        </p>
        <Link
          to='/products'
          className='bg-black text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-800 transition'
        >
          SHOP NOW
        </Link>
      </div>
    )
  }

  // ============================================
  // MAIN RETURN - shows when cart has items
  // ============================================
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-5xl mx-auto px-6 py-12'>

        {/* Title */}
        <h1 className='text-3xl font-bold tracking-widest mb-8'>
          YOUR CART
          {/* show total items count */}
          <span className='text-gray-400 text-lg ml-3'>
            ({totalItems} items)
          </span>
        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

          {/* ==============================
              LEFT SIDE - Cart Items List
              takes 2 columns on desktop
          ============================== */}
          <div className='lg:col-span-2 flex flex-col gap-4'>

            {/* Loop through each cart item */}
            {cartItems.map(item => (
              <div
                key={item._id}
                className='bg-white p-4 flex gap-4 shadow-sm'
              >

                {/* Product Image */}
                <img
                  src={`http://localhost:5000/${item.image}`}
                  alt={item.name}
                  className='w-24 h-24 object-cover'
                  // small thumbnail image
                />

                {/* Product Info */}
                <div className='flex-1'>

                  {/* Name */}
                  <h3 className='font-semibold text-sm mb-1'>
                    {item.name}
                  </h3>

                  {/* Price per item */}
                  <p className='text-gray-500 text-xs mb-3'>
                    ₹{item.price} each
                  </p>

                  {/* Quantity Controls */}
                  <div className='flex items-center gap-3'>

                    {/* Decrease button */}
                    <button
                      onClick={() => decreaseQty(item._id)}
                      // decreaseQty from CartContext
                      // won't go below 1!
                      className='w-7 h-7 border border-gray-300 hover:bg-gray-100 transition text-sm'
                    >
                      -
                    </button>

                    {/* Current quantity */}
                    <span className='text-sm font-semibold'>
                      {item.quantity}
                    </span>

                    {/* Increase button */}
                    <button
                      onClick={() => increaseQty(item._id)}
                      // increaseQty from CartContext
                      className='w-7 h-7 border border-gray-300 hover:bg-gray-100 transition text-sm'
                    >
                      +
                    </button>

                    {/* Item total price */}
                    <span className='text-sm font-bold ml-2'>
                      ₹{item.price * item.quantity}
                      {/* price × quantity = item total */}
                    </span>

                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  // removes this item completely from cart
                  className='text-gray-400 hover:text-red-500 transition text-xl self-start'
                >
                  ✕
                </button>

              </div>
            ))}

          </div>

          {/* ==============================
              RIGHT SIDE - Order Summary
              takes 1 column on desktop
          ============================== */}
          <div>
            <div className='bg-white p-6 shadow-sm'>

              <h2 className='font-bold text-lg tracking-wide mb-6'>
                ORDER SUMMARY
              </h2>

              {/* Items breakdown */}
              {cartItems.map(item => (
                <div
                  key={item._id}
                  className='flex justify-between text-sm text-gray-600 mb-2'
                >
                  {/* item name × quantity */}
                  <span>{item.name} × {item.quantity}</span>
                  {/* item total */}
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}

              {/* Divider line */}
              <div className='border-t border-gray-200 my-4'></div>

              {/* Total */}
              <div className='flex justify-between font-bold text-lg mb-6'>
                <span>TOTAL</span>
                <span>₹{totalPrice}</span>
                {/* totalPrice from CartContext */}
                {/* automatically calculated! */}
              </div>

              {/* Checkout Button */}
              {/* Only show if user is logged in */}
              {user ? (
                <button
                  onClick={() => setShowForm(true)}
                  // shows shipping address form
                  className='w-full bg-black text-white py-3 text-sm tracking-widest hover:bg-gray-800 transition'
                >
                  PROCEED TO CHECKOUT
                </button>
              ) : (
                // Not logged in → ask to login first
                <Link
                  to='/login'
                  className='block w-full bg-black text-white py-3 text-sm tracking-widest hover:bg-gray-800 transition text-center'
                >
                  LOGIN TO CHECKOUT
                </Link>
              )}

            </div>
          </div>

        </div>

        {/* ==============================
            SHIPPING ADDRESS FORM
            Shows when user clicks checkout
            Slides in as overlay
        ============================== */}
        {showForm && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          {/* fixed inset-0 = covers whole screen */}
          {/* bg-opacity-50 = semi transparent black */}
          {/* z-50 = on top of everything */}

            <div className='bg-white p-8 w-full max-w-md mx-4'>

              <h2 className='text-xl font-bold tracking-widest mb-6'>
                SHIPPING DETAILS
              </h2>

              {/* Error message */}
              {error && (
                <div className='bg-red-100 text-red-600 text-sm px-4 py-3 mb-4'>
                  {error}
                </div>
              )}

              {/* Shipping Form */}
              <form onSubmit={placeOrder} className='flex flex-col gap-4'>

                {/* Address */}
                <div>
                  <label className='text-sm text-gray-600 mb-1 block'>
                    Address
                  </label>
                  <input
                    type='text'
                    placeholder='Street address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className='w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black'
                  />
                </div>

                {/* City */}
                <div>
                  <label className='text-sm text-gray-600 mb-1 block'>
                    City
                  </label>
                  <input
                    type='text'
                    placeholder='Your city'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className='w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black'
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className='text-sm text-gray-600 mb-1 block'>
                    Pincode
                  </label>
                  <input
                    type='text'
                    placeholder='6 digit pincode'
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                    className='w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black'
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className='text-sm text-gray-600 mb-1 block'>
                    Phone
                  </label>
                  <input
                    type='text'
                    placeholder='10 digit phone number'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className='w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black'
                  />
                </div>

                {/* Buttons */}
                <div className='flex gap-3 mt-2'>

                  {/* Cancel button */}
                  <button
                    type='button'
                    onClick={() => setShowForm(false)}
                    // type='button' = doesn't submit form!
                    // closes the form
                    className='border border-black text-black px-6 py-2 text-sm flex-1 hover:bg-gray-100 transition'
                  >
                    CANCEL
                  </button>

                  {/* Place Order button */}
                  <button
                    type='submit'
                    disabled={loading}
                    className='bg-black text-white px-6 py-2 text-sm flex-1 hover:bg-gray-800 transition disabled:opacity-50'
                  >
                    {loading ? 'Placing...' : 'PLACE ORDER'}
                  </button>

                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default CartPage;
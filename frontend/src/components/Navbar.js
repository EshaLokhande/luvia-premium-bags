import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/cartContext'

const Navbar = () => {

  // Get user info and logout function from AuthContext
  const { user, logout } = useAuth()

  // Get cart items count from CartContext
  const { totalItems } = useCart()

  // For redirecting after logout
  const navigate = useNavigate()

  // For mobile menu open/close
  const [menuOpen, setMenuOpen] = useState(false)

  // Logout handler
  const handleLogout = () => {
    logout()            // clear user
    navigate('/login')  // go to login page
  }

  return (
    <nav className='bg-black text-white px-6 py-4'>

      {/* TOP ROW - Logo + Hamburger */}
      <div className='flex justify-between items-center'>

        {/* LOGO */}
        <Link
          to='/'
          className='text-2xl font-bold tracking-widest text-white'
        >
          LUVIA 🖤
        </Link>

        {/* DESKTOP LINKS - hidden on mobile */}
        <div className='hidden md:flex items-center gap-6'>

          {/* Products - always visible */}
          <Link
            to='/products'
            className='text-sm hover:text-gray-300 transition'
          >
            Products
          </Link>

          {/* Cart with count */}
          <Link
            to='/cart'
            className='text-sm hover:text-gray-300 transition'
          >
            🛒 Cart
            {/* Show count only if cart has items */}
            {totalItems > 0 && (
              <span className='ml-1 bg-white text-black text-xs px-2 py-0.5 rounded-full'>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Show if user is logged in */}
          {user ? (
            <>
              {/* My Orders */}
              <Link
                to='/myorders'
                className='text-sm hover:text-gray-300 transition'
              >
                My Orders
              </Link>

              {/* Admin link - only for admin */}
              {user.isAdmin && (
                <Link
                  to='/admin'
                  className='text-sm hover:text-gray-300 transition'
                >
                  Admin 👑
                </Link>
                // only show admin link if user.isAdmin is true 
               // && means "only if left side is true, show right side"
              )}

              {/* Username */}
              <span className='text-gray-400 text-sm'>
                Hi, {user.name}!
              </span>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className='border border-white text-white text-sm px-4 py-1.5 hover:bg-white hover:text-black transition'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Show if NOT logged in */}
              <Link
                to='/login'
                className='text-sm hover:text-gray-300 transition'
              >
                Login
              </Link>

              <Link
                to='/register'
                className='bg-white text-black text-sm px-4 py-1.5 hover:bg-gray-200 transition'
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* HAMBURGER - visible on mobile only */}
        <button
          className='md:hidden text-white text-2xl'
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
                    {/* // md:hidden = only show on mobile
            // !menuOpen = flip true→false or false→true
            // if open show ✕, if closed show ☰ */}

      </div>

      {/* MOBILE MENU - shows when hamburger clicked */}
      {menuOpen && (
        <div className='md:hidden flex flex-col gap-4 mt-4 border-t border-gray-700 pt-4'>
        {/* // only show when menuOpen = true
// flex-col = stack links vertically
// border-t = line at top to separate from navbar
// gap-4 = space between links */}
                  
          <Link to='/products' className='text-sm hover:text-gray-300'>
            Products
          </Link>

          <Link to='/cart' className='text-sm hover:text-gray-300'>
            🛒 Cart ({totalItems})
          </Link>

          {user ? (
            <>
              <Link to='/myorders' className='text-sm hover:text-gray-300'>
                My Orders
              </Link>

              {user.isAdmin && (
                <Link to='/admin' className='text-sm hover:text-gray-300'>
                  Admin 👑
                </Link>
              )}

              <span className='text-gray-400 text-sm'>
                Hi, {user.name}!
              </span>

              <button
                onClick={handleLogout}
                className='border border-white text-sm px-4 py-1.5 w-fit hover:bg-white hover:text-black transition'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/login' className='text-sm hover:text-gray-300'>
                Login
              </Link>

              <Link to='/register' className='text-sm hover:text-gray-300'>
                Register
              </Link>
            </>
          )}

        </div>
      )}

    </nav>
  )
}

export default Navbar;
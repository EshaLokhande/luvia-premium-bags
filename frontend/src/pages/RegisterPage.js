import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {

  // Store what user types
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Error and loading states
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Get login function from AuthContext
  const { login } = useAuth()

  // For redirecting after register
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if passwords match before calling API
    if (password !== confirmPassword) {
      return setError('Passwords do not match!')
    }

    try {
      setLoading(true)
      setError('')

      // Call our backend register API
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/register',
        { name, email, password }
      )

      // After register → automatically login
      login(data)

      // Redirect to home
      navigate('/')

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>

      <div className='bg-white p-8 w-full max-w-md shadow-md'>

        {/* Title */}
        <h2 className='text-3xl font-bold text-center mb-2 tracking-widest'>
          LUVIA
        </h2>
        <p className='text-center text-gray-500 mb-8 text-sm'>
          Create your account
        </p>

        {/* Error message */}
        {error && (
          <div className='bg-red-100 text-red-600 text-sm px-4 py-3 mb-4'>
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

          {/* Name Input */}
          <div>
            <label className='text-sm text-gray-600 mb-1 block'>
              Full Name
            </label>
            <input
              type='text'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black'
            />
          </div>

          {/* Email Input */}
          <div>
            <label className='text-sm text-gray-600 mb-1 block'>
              Email
            </label>
            <input
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black'
            />
          </div>

          {/* Password Input */}
          <div>
            <label className='text-sm text-gray-600 mb-1 block'>
              Password
            </label>
            <input
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black'
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className='text-sm text-gray-600 mb-1 block'>
              Confirm Password
            </label>
            <input
              type='password'
              placeholder='Confirm your password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className='w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black'
            />
          </div>

          {/* Register Button */}
          <button
            type='submit'
            disabled={loading}
            className='bg-black text-white py-2 text-sm tracking-widest hover:bg-gray-800 transition disabled:opacity-50'
          >
            {loading ? 'Creating Account...' : 'REGISTER'}
          </button>

        </form>

        {/* Login Link */}
        <p className='text-center text-sm text-gray-500 mt-6'>
          Already have an account?{' '}
          <Link to='/login' className='text-black font-bold hover:underline'>
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default RegisterPage
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'// for making API calls calling backend
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
    const [email, setEmail] = useState(''); // Store what user types in form
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Store error message if login fails
    const [loading, setLoading] = useState(false);// Store loading state while API call is happening

    const { login } = useAuth();// Get login function from AuthContext
    const navigate = useNavigate();

     // When user clicks Login button
    const handleSubmit = async (e) => {
        e.preventDefault(); //// Forms by default reload the page on submit This stops that reload!

        try {
            setLoading(true);// Show loading
            const { data } = await axios.post( //calling our backend:
                'http://localhost:5000/api/auth/login',
                { email, password }  // send this to backend
                // data = response from backend (user info + token)
            );
            login(data);// Save user info in AuthContext + localStorage
            navigate('/');
        } catch (err) {
            // Show error message
            setError(err.response?.data?.message || 'Something went wrong!')
        } finally {
            // Hide loading always
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
            <div className='bg-white p-8 w-full max-w-md shadow-md'>
                <h2 className='text-3xl font-bold text-center mb-2 tracking-widest'>Luvia</h2>
                <p className='text-center text-gray-500 mb-8 text-sm'>Login to your account</p>
                {error && (
                    <div className='bg-red-100 text-red-600 text-sm px-4 py-3 mb-4'>
                        {error}
                    </div>
                )}
            
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <div>
                        <label className='text-sm text-gray-600 mb-1 block'>Email</label>
                        <input type='email' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} required className='w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black' />
                        {/* // When user types → setEmail updates value */}
                    </div>
                    <div>
                        <label className='text-sm text-gray-600 mb-1 block'>Password</label>
                        <input type="password" placeholder="enter your passwword" value={password} onChange={(e) => setPassword(e.target.value)} required className='w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black' />
                    </div>
                    <button type='submit' disabled={loading} className='bg-black text-white py-2 text-sm tracking-widest hover:bg-gray-800 transition disabled:opacity-50' >
                        {loading ? 'Logging in...' : 'LOGIN'}
                    </button>
            
                </form>
            
                <p className='text-center text-sm text-gray-500 mt-6'>
                    Don't have an account?{''}
                    <Link to='/register' className='text-black font-bold hover:underline'>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );

};


export default LoginPage;
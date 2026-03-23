import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'


const AdminDashboard = () => {
    const { user } = useAuth();
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
            const { data: products } = await axios.get(
          'http://localhost:5000/api/products'
        )
            setTotalProducts(products.length);
         const { data: orders } = await axios.get(
          'http://localhost:5000/api/orders',
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        )
            setTotalOrders(orders.length);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
        fetchStats();
    }, []);


    if (!user || !user.isAdmin) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-black'>
                <p className='text-red-500 text-xl tracking-widest'>Acess Denied!</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-black'>
                <p className='text-gray-400'>Loading...</p>
            </div>  
        )
    }


    return (
        <div className='bg-black text-white min-h-screen p-10'>
            <h1 className='text-4xl tracking-wide'>DASHBOARD</h1>
            <p className='text-gray-500 text-xs tracking-widest mb-12'>MANAGE YOUR STORE</p>

            <div className='grid grid-cols-3 gap-2 mb-12 '>
                <div className='border border-gray-800 p-8'>
                    <p className='text-5xl font-light mb-2'>{totalProducts}</p>
                    <p className='text-xs tracking-widest text-gray-500'>Total Products</p>
                </div>
                <div className='border border-gray-800 p-8'>
                   <p className='text-5xl font-light mb-2'>{totalOrders}</p>
                    <p className='text-xs tracking-widest text-gray-500'>Total Orders</p> 
                </div>
            </div>


            <div className='grid grid-cols-2 gap-2'>
                <Link to='/admin/addproduct' className='border border-gray-800 p-10 hover:bg-white hover:text-black transition block'>
                    
                    <p className='text-3xl mb-4'>🛍️</p>
                        <p className='text-xl tracking-widest mb-2'>PRODUCTS</p>
                        <p className='text-xs text-gray-500 tracking-widest'>
                            ADD · DELETE · MANAGE
                        </p>
                        <p className='mt-8 text-2xl opacity-30'>→</p>
                </Link>
                
                 <Link
          to='/admin/orders'
          className='border border-gray-800 p-10 hover:bg-white hover:text-black transition block'
        >
          <p className='text-3xl mb-4'>📦</p>
          <p className='text-xl tracking-widest mb-2'>ORDERS</p>
          <p className='text-xs text-gray-500 tracking-widest'>
            VIEW · UPDATE STATUS
          </p>
          <p className='mt-8 text-2xl opacity-30'>→</p>
        </Link>
            </div>
        </div>
    );
}

export default AdminDashboard
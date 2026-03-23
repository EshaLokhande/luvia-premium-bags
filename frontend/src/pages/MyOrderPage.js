import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'

const MyOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/orders/myorders`, 
                                        {
                        headers: {
                        Authorization: `Bearer ${user.token}`
                        }
                    }
                );
                setOrders(data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
            <p className='text-gray-400'>Loading...</p>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <p>
                You have no orders yet. <Link to='/products' className='text-black font-bold hover:underline'>Start shopping!</Link>
            </p>
        )
    }


    return (
        <div className='min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto px-6 py-12'>

        <h1 className='text-3xl font-bold tracking-widest mb-8'>
          MY ORDERS
        </h1>

        <div className='flex flex-col gap-4'>
          {orders.map(order => (
            <div key={order._id} className='bg-white p-6 shadow-sm'>

              {/* Order Header */}
              <div className='flex justify-between items-center mb-4'>

                <div>
                  <p className='text-xs text-gray-400 mb-1'>ORDER ID</p>
                  <p className='text-sm font-semibold'>{order._id}</p>
                </div>

                <div>
                  <p className='text-xs text-gray-400 mb-1'>DATE</p>
                  <p className='text-sm'>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className='text-xs text-gray-400 mb-1'>TOTAL</p>
                  <p className='text-sm font-bold'>₹{order.totalPrice}</p>
                </div>

                <div>
                  <p className='text-xs text-gray-400 mb-1'>STATUS</p>
                  <p className={`text-sm font-semibold
                    ${order.status === 'Delivered' ? 'text-green-600' :
                      order.status === 'Shipped' ? 'text-yellow-600' :
                      'text-gray-600'}`}
                  >
                    {order.status}
                  </p>
                </div>

              </div>

              {/* Order Items */}
              <div className='border-t border-gray-100 pt-4'>
                {order.orderItems.map((item, index) => (
                  <div key={index} className='flex justify-between text-sm text-gray-600 mb-1'>
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
    )
}

export default MyOrderPage;
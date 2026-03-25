import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import API_URL from '../config'

const AdminOrdersPage = () => {

  // 1. states
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // 2. fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // const { data } = await axios.get(
          //   'http://localhost:5000/api/orders',
        const { data } = await axios.get(
  `${API_URL}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        )
        setOrders(data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // 3. update order status function
  const updateStatus = async (orderId, newStatus) => {
    try {
    //   await axios.put(
        //     `http://localhost:5000/api/orders/${orderId}/status`,
    await axios.put(
  `${API_URL}/api/orders/${orderId}/status`,

        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )

      // update orders in state without refetching!
      setOrders(orders.map(order =>
        order._id === orderId
          ? { ...order, status: newStatus }
          : order
      ))

    } catch (err) {
      console.log(err)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-5xl mx-auto px-6 py-12'>

        <h1 className='text-3xl font-bold tracking-widest mb-8'>
          ALL ORDERS
        </h1>

        {orders.length === 0 ? (
          <p className='text-gray-400'>No orders yet!</p>
        ) : (
          <div className='flex flex-col gap-4'>
            {orders.map(order => (
              <div key={order._id} className='bg-white p-6 shadow-sm'>

                {/* Order Info */}
                <div className='flex justify-between items-center mb-4'>

                  <div>
                    <p className='text-xs text-gray-400 mb-1'>ORDER ID</p>
                    <p className='text-sm font-semibold'>{order._id}</p>
                  </div>

                  <div>
                    <p className='text-xs text-gray-400 mb-1'>CUSTOMER</p>
                    <p className='text-sm'>{order.user?.name}</p>
                  </div>

                  <div>
                    <p className='text-xs text-gray-400 mb-1'>TOTAL</p>
                    <p className='text-sm font-bold'>₹{order.totalPrice}</p>
                  </div>

                  <div>
                    <p className='text-xs text-gray-400 mb-1'>DATE</p>
                    <p className='text-sm'>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <p className='text-xs text-gray-400 mb-1'>STATUS</p>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className='border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-black'
                    >
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </div>

                </div>

                {/* Order Items */}
                <div className='border-t border-gray-100 pt-4'>
                  {order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className='flex justify-between text-sm text-gray-600 mb-1'
                    >
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminOrdersPage
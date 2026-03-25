import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage' 
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import MyOrderPage from './pages/MyOrderPage'
import AdminDashboard from './pages/AdminDashboard'
import AddProductPage from './pages/AddProductPage'
import AdminOrdersPage from './pages/AdminOrderPage'

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/products/:id' element={<ProductDetailPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/myorders' element={<MyOrderPage />} />
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/admin/addproduct' element={<AddProductPage />} />
          <Route path='/admin/orders' element={<AdminOrdersPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
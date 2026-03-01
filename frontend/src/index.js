import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/cartContext.js'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <CartProvider>
       <App/>
    </CartProvider>
  </AuthProvider>
);
import React, { createContext, useState, useContext } from 'react';


// STEP 1 - CREATE CONTEXT
// Think of this as creating an empty trolley 🛒
// This "box" will hold all our cart data

const CartContext = createContext();



// STEP 2 - CREATE PROVIDER
// This wraps our whole app
// So every page can access cart data!
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]); // cartItems = array of products user added to cart

    // First check - is this product already in cart?
    // .find() searches through cartItems array
    // returns the item if found, undefined if not found
    const addToCart = (product) => {
        const exists = cartItems.find(item => item.id === product.id);
        if (exists) {
            // .map() loops through every item
            // if item matches → increase its quantity
            // if item doesn't match → keep it same (: item)
            // ...item = copy everything, just change quantity
            setCartItems(cartItems.map(item => item.id === product.id
                ?
                { ...item, quantity: item.quantity + 1 }
                : item,
            ));
        } else {
            // Add it fresh with quantity = 1
                // ...cartItems = keep existing items
                // ...product = copy all product details
                // quantity: 1 = start with 1
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    }

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter(item => item._id !== id));
    }

    const increaseQuantity = (id) => {
        setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    }

    const decreaseQuantity = (id) => {
         // found item AND quantity is more than 1 → decrease
        setCartItems(cartItems.map(item => item.id === id && item.quantity > 1
        ?
        { ...item, quantity: item.quantity - 1 }
        : item));
        // either not this item OR quantity is already 1 → keep same
    }

    const clearCart = () => {
        setCartItems([]);
    }

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            increaseQuantity,
            decreaseQuantity,
            clearCart,
            totalPrice,
            totalItems
        }}>
            {children}
        </CartContext.Provider>
    )



}
// STEP 3 - CUSTOM HOOK
// Instead of writing useContext(CartContext) everywhere
// We just write useCart() - much cleaner!
export const useCart = () => useContext(CartContext);









// 🤔 What is ...item?
// It's called spread operator — it means "copy everything from this object"
// Instead of writing:
// { _id: item._id, name: item.name, price: item.price, quantity: 2 }

// // We write:
// { ...item, quantity: 2 }
// // Copy everything from item, but change quantity to 2!
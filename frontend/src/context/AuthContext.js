import React, { createContext, useState, useContext } from 'react'

// Step 1 - Create the context (like a global box to store user info)
const AuthContext = createContext()

// Step 2 - Create the provider (wraps our whole app)
export const AuthProvider = ({ children }) => {

  // Check if user is already logged in (saved in localStorage)
  const [user, setUser] = useState(
    localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null
  )

  // LOGIN - save user info + token in localStorage
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  // LOGOUT - remove user info from localStorage
  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    // Share user, login, logout with ALL components
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Step 3 - Custom hook to use auth anywhere easily
export const useAuth = () => useContext(AuthContext);




// ### 🤔 What is Context?

// Imagine you have user info after login. Now you need it in:
// - Navbar (show username)
// - Cart (who is ordering)
// - Orders (whose orders)

// Without context you'd have to **pass it through every component** like a long chain! 😵
// ```
// App → Navbar → UserMenu → Username 😵
// ```

// With context it's like a **global variable** — any component can grab it directly! 😊
// ```
// Any component → useAuth() → get user instantly ✅

// 🤔 What is localStorage?
// It's like a mini database in your browser!
// Even if you refresh the page or close browser — the user stays logged in because we saved their info in localStorage! 😊
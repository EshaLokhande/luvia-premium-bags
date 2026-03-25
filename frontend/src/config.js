const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

export default API_URL
    
    


// ### 🤔 What is this?

// REACT_APP_API_URL → this will be our live backend URL on Render
// || means "OR"
// so:
// → if REACT_APP_API_URL exists → use live URL
// → if not → use localhost:5000 (for local development)
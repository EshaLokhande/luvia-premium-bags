//just starts the server + connects database (Boss — manages everything)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");//imported n connected authRoutes
dotenv.config(); // This loads our secret variables from .env file

const app = express();
// Middleware - allows our server to understand JSON data
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/uploads", express.static("uploads"));// This makes our uploads folder publicly accessible (for images)


app.get("/", (req, res) => {
    res.send("Luvia backend is running");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB error", err)
    }
    
);
    
// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `)
})
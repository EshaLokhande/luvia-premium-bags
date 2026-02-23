// checks if user is logged in (security guard)
const jwt = require("jasonwebtoken");
const User = require("../models/User");

//PROTECT - checks if user is logged in (Hey, I'm the security guard named protect")
const protect = async (req, res, next) => {
    //get the token from header(Let me check what the user is carrying in their hand (header)")
    const authHeader = req.headers.authorization;
    
    //if no token found block request("They have nothing in their hand? Or it doesn't look like a wristband? BLOCK THEM!)
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: 'No token, access denied' })
    }

    try {
        // "The wristband looks like 'Bearer abc123' — I only need the 'abc123' part, not the word Bearer"
        const token = authHeader.split(' ')[1];
        //Let me scan this wristband — is it real or fake? 🔍"
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        //"Wristband is real! Let me find who this person is in our database 📋"
        req.user = await User.findById(decoded.id).select("-password");
        //"All good! You can go in! ✅
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' })
    }
};

const adminOnly = (req, res, isAdmin) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(401).json({ message: 'Admins only' });
    }
};
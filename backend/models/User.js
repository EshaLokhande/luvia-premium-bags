const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });  //Auto adds createdAt & updatedAt

module.exports = mongoose.model("User", userSchema);
//module.exports at the bottom means we're making this available to use in other files — like our routes.

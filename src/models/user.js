const mongoose = require("mongoose");
const { isEmail } = require("validator");

const usersSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        lowercase: true,
        trim: true
    },
    mail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: [isEmail, "Email inválido"],
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

const User = mongoose.model("User", usersSchema)
module.exports = {User};
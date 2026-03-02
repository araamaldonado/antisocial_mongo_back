const mongoose = require("mongoose");
const { isEmail } = require("validator");

const usersSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    mail: {
        type: String,
        required: true,
        validate: [isEmail, "Email inválido"]
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

const User = mongoose.model("User", usersSchema)
module.exports = {User};
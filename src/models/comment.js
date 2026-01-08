const mongoose = require("mongoose")

const commentsSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    post: {type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true},
    texto: {
        type: String,
        required: true,
        minlength: 1
    },
    visible: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentsSchema)
module.exports = { Comment }
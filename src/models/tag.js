const mongoose = require("mongoose")

const tagsSchema = new mongoose.Schema({
    nombre: {
        type: String,
        unique: true,
        required: true
    }
})

const Tag = mongoose.model("Tag", tagsSchema)

module.exports = { Tag }
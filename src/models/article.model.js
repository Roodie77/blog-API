const mongoose = require("mongoose")
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
    },
    content: {
        type: String,
        required: true,
        minlength: 20,
    },
    images: {
        type: [{
            _id: false,
            url: { type: String, required: true },
            publicId: { type: String, required: true }
        }],
        default: [],
        validate: [(v) => v.length <= 5, 'A post can have at most 5 images']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

}, { timestamps: true });

articleSchema.index({ title: "text", content: "text", author: "text" });

const Article = mongoose.model("Article", articleSchema)
module.exports = Article
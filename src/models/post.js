const mongoose = require("mongoose")

const postsSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true    
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }],
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostImage"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    texto: {
        type: String,
        required: true
    }
})

postsSchema.pre('remove', async function(next) {
    const Comment = require("./comment");
    const PostImage = require("./postImage");
    try {
        await Comment.deleteMany({ post: this._id });
        await PostImage.deleteMany({ _id: { $in: this.images } });
        next();
    } catch (err) {
        next(err);
    }
});

const Post = mongoose.model("Post", postsSchema)
module.exports = { Post }
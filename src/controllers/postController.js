const { Post } = require("../models/post");
const { Comment } = require("../models/comment");
const { User } = require("../models/user");
const { PostImage } = require("../models/postImage");

const createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "nickname mail")
      .populate("tags", "nombre")
      .populate("images", "url")
      .lean();

    const comments = await Comment.find().select("_id post").lean();

    const commentsByPost = comments.reduce((acc, c) => {
      if (!acc[c.post]) acc[c.post] = [];
      acc[c.post].push(c._id);
      return acc;
    }, {});

    const postsWithComments = posts.map((post) => ({
      ...post,
      comments: commentsByPost[post._id] || [],
    }));

    res.status(200).json(postsWithComments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPostsByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await Post.find({ user: id })
      .populate("tags", "nombre")
      .populate("images", "_id")
      .lean();

    const comments = await Comment.find().select("_id post").lean();

    const commentsByPost = comments.reduce((acc, c) => {
      if (!acc[c.post]) acc[c.post] = [];
      acc[c.post].push(c._id);
      return acc;
    }, {});

    const postsWithComments = posts.map((post) => ({
      ...post,
      comments: commentsByPost[post._id] || [],
    }));

    res.status(200).json(postsWithComments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("user", "nickname mail")
      .populate("tags", "nombre")
      .populate("images")
      .lean();

    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    const months = parseInt(process.env.COMMENT_RETENTION_MONTHS || "6", 10);
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);

    const comments = await Comment.find({
      post: postId,
      createdAt: { $gte: cutoff },
      visible: true,
    })
      .populate("user", "nickname")
      .sort({ createdAt: -1 });

    post.comments = comments;
    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error interno" });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!post) return res.status(404).json({ error: "Post no encontrado" });
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Borrar imagen de post
const deleteImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    const post = await Post.findById(id);

    post.images = post.images.filter((id) => id.toString() !== imageId);

    await post.save();
    const deletedImage = await PostImage.findByIdAndDelete(imageId);

    const updatedPost = await Post.findById(id)
      .populate("user", "nickname mail")
      .populate("tags", "nombre")
      .populate("images", "url");

    res.status(200).json({
      message: "Imagen eliminada correctamente",
      post: updatedPost,
    });
  } catch (err) {
    console.error("Error al eliminar la imagen del post:", err);
    res.status(500).json({
      error: "Error al eliminar la imagen del post",
      message: err.message,
    });
  }
};

// Agregar imagen a post
const addImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageId } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $addToSet: { images: imageId } },
      { new: true }
    )
      .populate("user", "nickname mail")
      .populate("tags", "nombre")
      .populate("images", "url");

    res.status(200).json({
      message: "Imagen agregada correctamente",
      post: updatedPost,
    });
  } catch (err) {
    console.error("Error al agregar la imagen del post:", err);
    res.status(500).json({
      error: "Error al agregar la imagen del post",
      message: err.message,
    });
  }
};

//agregar tag a post
const addTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { tagId } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $addToSet: { tags: tagId } },
      { new: true }
    )
      .populate("user", "nickname mail")
      .populate("tags", "nombre")
      .populate("images", "url");

    res.status(200).json({
      message: "Tag agregado correctamente",
      post: updatedPost,
    });
  } catch (err) {
    console.error("Error al agregar la tag al post:", err);
    res.status(500).json({
      error: "Error al agregar la tag al post",
      message: err.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  getPostsByUserId,
  updatePost,
  deletePost,
  deleteImage,
  addImage,
  addTag,
};
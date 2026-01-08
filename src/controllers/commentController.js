const { Comment } = require("../models/comment");
const { client } = require("../config/redisClient");

const KEY_ALL = "comments : all";
const keyOne = (id) => `comments:${id}`;

const createComment = async (req, res) => {
  try {
    const comment = new Comment({
      texto: req.body.texto,
      post: req.body.post,
      user: req.body.user,
    });
    await comment.save();
    await client.del(KEY_ALL);
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getComments = async (req, res) => {
  try {
    const cached = await client.get(KEY_ALL);
    if (cached) {
      console.log("Cache hit");
      return res.status(200).json(JSON.parse(cached));
    }
    console.log("Cache miss --> Consultando a MongoDB");
    const months = parseInt(process.env.VISIBLE_COMMENTS_MONTHS ?? 6);
    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - months);

    const comments = await Comment.find({ createdAt: { $gte: dateLimit } });

    await client.set(KEY_ALL, JSON.stringify(comments), { EX: 60 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    const id = req.params.id;
    const key = keyOne(id);
    const cached = await client.get(key);
    if (cached) {
      console.log(`Cache hit [${id}]`);
      return res.status(200).json(JSON.parse(cached));
    }
    console.log(`Cache miss [${id}]--> Consultando a MongoDB`);
    const comment = await Comment.findById(id);
    await client.set(key, JSON.stringify(comment), { EX: 60 });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const id = req.params.id;
    const key = keyOne(id);
    const comment = await Comment.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await client.del(KEY_ALL);
    await client.del(key);
    res.status(200).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    const key = keyOne(id);
    const comment = await Comment.findByIdAndDelete(id);
    await client.del(KEY_ALL);
    await client.del(key);
    res.json({ message: "Comentario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
};
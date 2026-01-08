const { PostImage } = require("../models/postImage");
const { client } = require("../config/redisClient");

const KEY_ALL = "postImages : all";
const keyOne = (id) => `postImages:${id}`;

const createPostImage = async (req, res) => {
  try {
    const body = req.body;

    const images = Array.isArray(body)
      ? await PostImage.insertMany(body)
      : [await PostImage.create(body)];

    await client.del(KEY_ALL);
    res.status(201).json(images);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPostImages = async (req, res) => {
  try {
    const cached = await client.get(KEY_ALL);
    if (cached) {
      console.log("Cache hit");
      return res.status(200).json(JSON.parse(cached));
    }
    console.log("Cache miss --> Consultando a MongoDB");
    const images = await PostImage.find();
    await client.set(KEY_ALL, JSON.stringify(images), { EX: 60 });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPostImageById = async (req, res) => {
  try {
    const id = req.params.id;
    const key = keyOne(id);
    const cached = await client.get(key);
    if (cached) {
      console.log(`Cache hit [${id}]`);
      return res.status(200).json(JSON.parse(cached));
    }
    console.log(`Cache miss [${id}]--> Consultando a MongoDB`);
    const image = await PostImage.findById(id);
    await client.set(key, JSON.stringify(image), { EX: 60 });
    res.json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updatePostImage = async (req, res) => {
  try {
    const id = req.params.id;
    const key = keyOne(id);
    const image = await PostImage.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await client.del(KEY_ALL);
    await client.del(key);
    res.json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deletePostImage = async (req, res) => {
  try {
    const id = req.params.imageId;
    const key = keyOne(id);
    const image = await PostImage.findByIdAndDelete(id);
    await client.del(KEY_ALL);
    await client.del(key);
    res.json({ message: "Imagen eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPostImageById,
  getPostImages,
  createPostImage,
  updatePostImage,
  deletePostImage,
};
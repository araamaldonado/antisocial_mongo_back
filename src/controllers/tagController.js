const { Tag } = require("../models/tag");
const { client } = require("../config/redisClient");

const KEY_ALL = "tags : all";
const keyOne = (id) => `tags:${id}`;

const createTag = async (req, res) => {
  try {
    const tag = await Tag.insertMany(req.body);
    await client.del(KEY_ALL);
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getTags = async (req, res) => {
  try {
    const cached = await client.get(KEY_ALL);
    if (cached) {
      console.log("Cache hit");
      return res.status(200).json(JSON.parse(cached));
    }
    console.log("Cache miss --> Consultando a MongoDB");
    const tags = await Tag.find({});
    await client.set(KEY_ALL, JSON.stringify(tags), { EX: 60 });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTagById = async (req, res) => {
  try {
    const id = req.params.id;
    const key = keyOne(id);
    const cached = await client.get(key);
    if (cached) {
      console.log(`Cache hit [${id}]`);
      return res.status(200).json(JSON.parse(cached));
    }
    console.log(`Cache miss [${id}]--> Consultando a MongoDB`);
    const tag = await Tag.findById(id);
    await client.set(key, JSON.stringify(tag), { EX: 60 });
    res.status(200).json(tag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateTag = async (req, res) => {
  try {
    const id = req.params.id;
    const key = keyOne(id);
    const tag = await Tag.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await client.del(KEY_ALL);
    await client.del(key);
    res.status(200).json(tag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    const id = req.params.id;
    const key = keyOne(id);
    const tag = await Tag.findByIdAndDelete(id);
    await client.del(KEY_ALL);
    await client.del(key);
    res.status(200).json({ message: "Etiqueta eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createTag, getTags, getTagById, updateTag, deleteTag };
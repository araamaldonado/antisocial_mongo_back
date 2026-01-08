const { User } = require("../models/user");
const { client } = require("../config/redisClient");

const KEY_ALL = "users : all";
const keyOne = (id) => `users:${id}`;

const getUser = async (req, res) => {
  try {
    const cached = await client.get(KEY_ALL);
    if (cached) {
      console.log("Cache hit");
      return res.status(200).json(JSON.parse(cached));
    }
    console.log("Cache miss --> Consultando a MongoDB");
    const users = await User.find({});
    await client.set(KEY_ALL, JSON.stringify(users), { EX: 60 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const key = keyOne(id);
    const cached = await client.get(key);
    if (cached) {
      console.log(`Cache hit [${id}]`);
      return res.status(200).json(JSON.parse(cached));
    }
    console.log(`Cache miss [${id}]--> Consultando a MongoDB`);
    const userFound = await User.findById(id);
    await client.set(key, JSON.stringify(userFound), { EX: 60 });
    res.status(200).json(userFound);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getUserByNickname = async (req, res) => {
  try {
    const nickname = req.params.nickname;
    const user = await User.findOne({ nickname });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { nickname, mail } = req.body;
    await client.del(KEY_ALL);
    const newUser = await User.create({ nickname, mail });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const key = keyOne(id);
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });
    await client.del(KEY_ALL);
    await client.del(key);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const key = keyOne(id);
    const deletedUser = await User.findByIdAndDelete(id);
    await client.del(KEY_ALL);
    await client.del(key);
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getUser,
  getUserById,
  getUserByNickname,
  createUser,
  updateUser,
  deleteUser,
};
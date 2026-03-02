const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const registerUser = async ({ nickname, mail, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({ nickname, mail, password: hashedPassword });
};

const login = async (nickname, password) => {
  // 1. Buscar usuario
  const user = await User.findOne({ nickname });
  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  // 2. Comparar contraseña
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Credenciales inválidas");
  }

  const payload = { 
    id: user._id,
    nickname: user.nickname,
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30s" })

  // 3. Retornar usuario SIN password
  return {
    user: {
      _id: user._id,
    nickname: user.nickname,
    mail: user.mail,
    },
    token,
  };
};

module.exports = { registerUser, login };

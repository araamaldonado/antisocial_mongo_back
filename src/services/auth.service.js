const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { generateAccessToken, 
    generateRefreshToken } = require("../utils/token")


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

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  // 3. Retornar usuario SIN password
  return {
    user: {
      _id: user._id,
    nickname: user.nickname,
    mail: user.mail,
    },
    accessToken
    ,
    refreshToken
  };
};

module.exports = { registerUser, login };

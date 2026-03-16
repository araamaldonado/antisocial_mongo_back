const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { Session } = require("../models/sessions")
const jwt = require("jsonwebtoken")
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

  const newSession = await Session.create({
    userId: user._id,
    refreshToken: "temp",
    expiresAt: new Date(Date.now() + 7*24*60*60*1000)
  })

  const refreshToken = generateRefreshToken(user, newSession)

  newSession.refreshToken = refreshToken
  await newSession.save()

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

const logout = async (refreshToken) => {

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    await Session.findByIdAndDelete(decoded.sessionId)

  } catch (error) {

  }
}

module.exports = { registerUser, login, logout };

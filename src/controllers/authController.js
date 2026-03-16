const jwt = require("jsonwebtoken")
const { generateAccessToken } = require("../utils/token")
const { Session } = require("../models/sessions")

const refreshToken = async (req, res) => {

  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken){
      return res.status(401).json({ message: "Refresh token requerido" })
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    const session = await Session.findById(decoded.sessionId)

    if(!session){
      return res.status(403).json({ message: "Sesión inexistente" })
    }

    if (session.userId.toString() !== decoded.userId) {
      return res.status(403).json({ message: "Usuario no coincide" })
    }

    if (new Date() > session.expiresAt) {
      await Session.findByIdAndDelete(decoded.sessionId)
      return res.status(403).json({ message: "Sesión expirada" })
    }

    const newAccessToken = generateAccessToken({
      userId: decoded.userId
    })

    return res.status(200).json({ accessToken: newAccessToken })

  } catch (error) {
    return res.status(403).json({ message: "Refresh token inválido" })
  }
}

module.exports = { refreshToken }
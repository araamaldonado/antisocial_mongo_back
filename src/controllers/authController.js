const jwt = require("jsonwebtoken")
const { generateAccessToken } = require("../utils/token")

const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken

  if (!token){
    return res.status(401).json({ message: "Refresh token requerido" })
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

    const newAccessToken = generateAccessToken({
      _id: decoded.id,
      nickname: decoded.nickname
    })

    return res.status(200).json({
      accessToken: newAccessToken
    })

  } catch (error) {

    return res.status(403).json({
      message: "Refresh token inválido"
    })
  }
}

module.exports = { refreshToken }
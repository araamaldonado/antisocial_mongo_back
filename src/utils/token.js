const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {

    const payload = { 
    userId: user._id
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30s" })

}

const generateRefreshToken = (user, session) => {

  const payload = { 
    userId: user._id,
    sessionId: session._id
  }

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" })
}

module.exports = { generateAccessToken, generateRefreshToken }
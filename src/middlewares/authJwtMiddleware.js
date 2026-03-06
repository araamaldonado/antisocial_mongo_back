const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;


  if (!authHeader) {
    return res.status(401).json({ message: "Token no provisto" });
  }

  // SEGUIR CORRIGIENDO QUE EL TOKEN CIERRE EFECTIVAMENTE LA SESION

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next()
  } catch (error) {
    return res.status(401).json({ message: "Token invalido o expirado" })
  }
}

module.exports = {verifyToken}
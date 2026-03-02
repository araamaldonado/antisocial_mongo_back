const jwt = require("jsonwebtoken");

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;


  if (!authHeader) {
    return res.status(401).json({ message: "Token no provisto" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next()
  } catch (error) {
    return res.status(401).json({ message: "Token invalido o expirado" })
  }
}
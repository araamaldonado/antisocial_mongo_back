const { User } = require("../models/user");
const genericSchemaValidator = require("../schemas/genericSchemaValidator");
const userSchema = require("../schemas/user.schema");
const validarById = require("../middlewares/generic.middleware");

const validarUserById = validarById(User);

const validarUserByNickname = async (req, res, next) => {
  const nickname = req.params.nickname;

  const found = await User.findOne({ nickname });
  if (!found) {
    res
      .status(404)
      .json({ error_message: `El nickname ${nickname} no fue encontrado` });
    return;
  }
  next();
};

const verifyLoginCredentials = async (req, res, next) => {
  try {
    const { nickname, password } = req.body;

    const nicknameSanitizado = nickname?.trim().toLowerCase()

    if (!nicknameSanitizado){
      return res.status(400).json({ message: "Ingrese un nickname válido" })
    }

    if (!password || password.length < 8){
      return res.status(400).json({ message: "Ingrese una contraseña válida" })
    }

    req.body.nickname = nicknameSanitizado 

    next()

  } catch (error) {
    res.status(401).json({ message: "Error al validar las credenciales" })
  }
}

const existUserName = async (req, res, next) => {
  try {
    const { nickname } = req.body;

    const found = await User.findOne({ nickname });
    if (found)
      return res
        .status(409)
        .json({ message: "El nombre de usuario ya existe" });

    next();
  } catch (error) {
    res.status(500).json({ message: "Error al validar el nombre de usuario" });
  }
};

const existMail = async (req, res, next) => {
  try {
    const { mail } = req.body;

    const found = await User.findOne({ mail });
    if (found) return res.status(409).json({ message: "El mail ya existe" });

    next();
  } catch (error) {
    res.status(500).json({ message: "Error al validar el mail" });
  }
};

const validarSchemaUser = (req, res, next) => {
  const { error, _ } = genericSchemaValidator(userSchema, req.body);
  if (error) {
    return res.status(400).json({
      errores: error.details.map((e) => ({
        attributo: e.path[0],
        detalle: e.message,
      })),
    });
  }
  next();
};

module.exports = {
  existUserName,
  validarSchemaUser,
  validarUserById,
  validarUserByNickname,
  existMail,
  verifyLoginCredentials
};
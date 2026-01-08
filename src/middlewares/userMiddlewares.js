const { User } = require("../models/user");
const genericSchemaValidator = require("../schemas/genericSchemaValidator");
const userSchema = require("../schemas/user.schema");
const validarById = require("../middlewares/generic.middleware");

const validarUserById = validarById(User);

const validarUserByNickname = async (req, res, next) => {
  const nickname = req.params.nickname;

  const found = await User.findOne({ nickname });
  if (!found) {
    console.log("a");
    res
      .status(404)
      .json({ error_message: `El nickname ${nickname} no fue encontrado` });
    return;
  }
  next();
};

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
    console.log("a");
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
};
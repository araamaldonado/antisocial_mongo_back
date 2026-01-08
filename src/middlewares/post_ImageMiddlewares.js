const { PostImage } = require("../models/postImage");
const genericSchemaValidator = require("../schemas/genericSchemaValidator");
const postimageSchema = require("../schemas/postImage.schema");
const validarById = require("./generic.middleware");

const flexiblePostImageSchema = require("../schemas/flexiblePostImageSchema");

// Verifica que la imagen exista por ID
const validarPostImageId = validarById(PostImage);

const validarSchemaPostImage = (req, res, next) => {
  const { error } = genericSchemaValidator(flexiblePostImageSchema, req.body);
  if (error) {
    return res.status(400).json({
      errores: error.details.map((e) => ({
        atributo: e.path.join("."),
        detalle: e.message,
      })),
    });
  }
  next();
};

module.exports = {
  validarPostImageId,
  validarSchemaPostImage,
};
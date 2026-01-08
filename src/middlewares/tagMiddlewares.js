const { Tag } = require("../models/tag");
const genericSchemaValidator = require("../schemas/genericSchemaValidator");
const tagSchema = require("../schemas/tag.schema");
const validarById = require("./generic.middleware");

const validarTagId = validarById(Tag);

const existTag = async (req, res, next) => {
  try {
    const tags = Array.isArray(req.body) ? req.body : [req.body];

    if (!tags.length || tags.some((t) => !t.nombre)) {
      return res.status(400).json({ error: "Cada tag debe tener un nombre válido" });
    }

    // Buscamos si alguno ya existe
    const nombres = tags.map((t) => t.nombre);
    const found = await Tag.find({ nombre: { $in: nombres } });

    if (found.length > 0) {
      const existentes = found.map((t) => t.nombre).join(", ");
      return res
        .status(409)
        .json({ error: `Ya existen los siguientes tags: ${existentes}` });
    }

    next();
  } catch (error) {
    console.error("Error en existTag:", error);
    return res.status(500).json({ error: "Error al validar tag" });
  }
};

const validarSchemaTag = (req, res, next) => {
  const { error, _ } = genericSchemaValidator(tagSchema, req.body);
  if (error) {
    return res.status(400).json({
      errores: error.details.map((e) => {
        return {
          attributo: e.path[0],
          detalle: e.message,
        };
      }),
    });
  }
  next();
};
module.exports = { existTag, validarSchemaTag, validarTagId };
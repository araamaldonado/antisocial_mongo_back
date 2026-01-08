const Joi = require("joi");
const userSchema = require("./user.schema");

// Validador para ObjectId de MongoDB
const mongoIdSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "Debe ser un ID de MongoDB válido de 24 caracteres",
    "any.required": "El ID es obligatorio",
  });

// Esquema de validación del Post
const postTagImageSchema = Joi.object({
  texto: Joi.string().trim().min(1).required().messages({
    "string.empty": "El texto del post no puede estar vacío",
    "any.required": "El texto del post es obligatorio",
  }),

  user: Joi.alternatives().try(mongoIdSchema, userSchema).required().messages({
    "alternatives.match":
      "El campo user debe ser un ID de MongoDB válido o un objeto de usuario válido",
  }),

  tags: Joi.array().items(mongoIdSchema).optional().messages({
    "array.base": "Tags debe ser un array de IDs",
    "string.pattern.base": "Cada tag debe ser un ID de MongoDB válido",
  }),

  images: Joi.array().items(mongoIdSchema).optional().messages({
    "array.base": "Images debe ser un array de IDs",
    "string.pattern.base": "Cada image debe ser un ID de MongoDB válido",
  }),
}).options({
  allowUnknown: true, // permite otros campos como createdAt, __v, etc.
});

module.exports = postTagImageSchema;
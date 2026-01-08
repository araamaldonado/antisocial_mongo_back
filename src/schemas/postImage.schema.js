const Joi = require("joi");

const postImageSchema = Joi.object({
  url: Joi.string().trim().uri().required().messages({
    "string.empty": "Ingrese la URL de la imagen",
    "string.uri": "La URL de la imagen debe ser válida",
    "any.required": "El atributo url tiene que existir",
  }),
});

module.exports = postImageSchema;
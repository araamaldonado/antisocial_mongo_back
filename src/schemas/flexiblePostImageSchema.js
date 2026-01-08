const Joi = require("joi");

// 1. Esquema de un solo elemento (lo que ya tienes)
const singlePostImageSchema = Joi.object({
  url: Joi.string().trim().uri().required().messages({
    "string.empty": "Ingrese la URL de la imagen",
    "string.uri": "La URL de la imagen debe ser válida",
    "any.required": "El atributo url tiene que existir",
  }),
});

// 2. Esquema para un ARRAY de imágenes
const arrayPostImagesSchema = Joi.array()
  .items(singlePostImageSchema)
  .min(1)
  .required();

// 3. Esquema Alternativo: Acepta el objeto O el array
const flexiblePostImageSchema = Joi.alternatives().try(
  arrayPostImagesSchema, // Opción A: Un array de objetos (múltiples imágenes)
  singlePostImageSchema // Opción B: Un objeto simple (una sola imagen)
);

module.exports = flexiblePostImageSchema;
const multer = require("multer");
const path = require("path");

// Configuracion de almacenamiento:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Filtro que permite solo imagenes:
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "imager/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imagenes .jpg y .png"), false);
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
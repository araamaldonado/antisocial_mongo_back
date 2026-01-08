const mongoose = require("mongoose");

const connectToDataBase = async () => {
  const user = "admin";
  const pass = "admin1234";
  const db = "netData";
  const host = "localhost";

  try {
    await mongoose.connect(
      `mongodb://${user}:${pass}@${host}:27017/${db}?authSource=admin`
    );
    console.log("Conectado a MongoDB correctamente");
  } catch (err) {
    console.error("Error al conectar:", err.message);
  }
};

module.exports = connectToDataBase;
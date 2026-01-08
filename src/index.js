require("dotenv").config(); // Cargar variables del .env
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Conexion a db:
const connectToDataBase = require("./config/db");
const { connectRedis } = require("./config/redisClient");

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(helmet());
app.use(morgan("dev"));

// Cors del frontend:
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Utilizar JSON:
app.use(express.json());

// Rutas:
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const tagRoute = require("./routes/tagRoute");
const commentRoute = require("./routes/commentRoute");
const imageRoute = require("./routes/postImageRoute");

// Endpoints:
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/tag", tagRoute);
app.use("/comment", commentRoute);
app.use("/image", imageRoute);

// Configuración del Swagger:
const swaggerDocument = YAML.load(path.join(__dirname, "./docs/swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Manejo de errores globales:
app.use((err, req, res, next) => {
  console.error("Error en middleware:", err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

process.on("uncaughtException", (err) => {
  console.error("Error no capturado:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Promesa rechazada sin catch:", reason);
});

// Iniciar el servidor:
async function startServer() {
  try {
    await connectToDataBase();
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
      console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error("Error al iniciar el servidor:", err);
    process.exit(1);
  }
}

startServer();
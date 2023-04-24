const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const {
  unidadeRoutes,
  usuarioRoutes,
  pacienteRoutes,
} = require("./src/routes/v1");
const AppError = require("./src/utils/appError");
const errorMiddleware = require("./src/utils/errorMiddleware");
const { nodeEnv } = require("./configEnv");

let allowedOrigins;

if (nodeEnv === "development") {
  allowedOrigins = ["http://127.0.0.1:5173"];
} else if (nodeEnv === "production") {
  allowedOrigins = ["http://127.0.0.1:5173"];
}

// config
const app = express();
app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "Origin não está autorizada!";

        return callback(new AppError(msg, 403));
      }

      return callback(null, true);
    },
    exposedHeaders: ["authorization"],
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(xss());
app.use(hpp());
app.disable("x-powered-by");

// rotas
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Muitas requisições pelo mesmo usuario!",
});

app.use("/api/v1/unidades", limiter, unidadeRoutes);
app.use("/api/v1/usuarios", limiter, usuarioRoutes);
app.use("/api/v1/pacientes", limiter, pacienteRoutes);

// not found
app.all("*", (req, res, next) => {
  next(new AppError(`Não foi encontrada a rota ${req.originalUrl}`, 404));
});

// errors
app.use(errorMiddleware);

module.exports = app;

const { nodeEnv } = require("../../configEnv");
const AppError = require("./appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR: ", err);

    res.status(500).json({
      status: "error",
      message: "Algo deu muito errado!",
    });
  }
};

// erro de banco de dados
const validationErrorsHandler = (err) => {
  const errors = Object.values(err.errors).map((el) => el.path);

  const message = `o(s) campo(s) ${errors.join(", ")} estão invalidos!`;
  return new AppError(message, 400);
};

const uniqueConstraintHandler = (err) => {
  const errors = Object.values(err.errors).map((el) => el.path);

  const message = `o(s) campo(s) ${errors.join(", ")} já existem!`;
  return new AppError(message, 400);
};

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    res.status(400).json({
      type: err.type,
      message: err.error.toString(),
    });
  } else {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (nodeEnv === "development") {
      sendErrorDev(err, res);
    } else if (nodeEnv === "production") {
      let error = Object.assign(err);

      if (error.name === "SequelizeValidationError")
        error = validationErrorsHandler(error);

      if (error.name === "SequelizeUniqueConstraintError")
        error = uniqueConstraintHandler(error);

      sendErrorProd(error, res);
    }
  }
};

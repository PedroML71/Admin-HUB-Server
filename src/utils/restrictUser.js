const { nodeEnv } = require("../../configEnv");
const AppError = require("./appError");

module.exports =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req?.user?.role) && nodeEnv !== "development") {
      return next(new AppError("Acesso não autorizado!", 401));
    }

    next();
  };

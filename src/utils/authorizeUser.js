const catchAsync = require("./catchAsync");
const { nodeEnv } = require("../../configEnv");
const { auth } = require("../../firebaseConfig");
const AppError = require("./appError");
const { Usuario } = require("../../models");

module.exports = catchAsync(async (req, res, next) => {
  if (nodeEnv === "development") {
    const authorizationHeader = req.headers["authorization"];
    let refId = "none";

    if (authorizationHeader) {
      const token = authorizationHeader.split(" ")[1];

      const decodedToken = await auth.verifyIdToken(token);

      if (decodedToken) {
        refId = decodedToken.uid;

        const currentUser = await Usuario.findOne({
          where: { codigoFire: refId },
        });

        if (!currentUser) {
          return next(new AppError("Usuario não encontrado!", 404));
        }

        req.user = currentUser;
      }
    }

    req.params.refId = refId;
    next();
  } else if (nodeEnv === "production") {
    const authorizationHeader = req.headers["authorization"];
    let refId;

    if (!authorizationHeader) {
      return next(new AppError("Você não está autorizado!", 401));
    }

    const token = authorizationHeader.split(" ")[1];

    try {
      const decodedToken = await auth.verifyIdToken(token);
      refId = decodedToken.uid;

      req.params.refId = refId;
    } catch (error) {
      return next(new AppError("Você não está autorizado!", 401));
    }

    const currentUser = await Usuario.findOne({
      where: { codigoFire: refId, status: true },
    });

    if (!currentUser) {
      return next(new AppError("Usuario não encontrado!", 404));
    }

    req.user = currentUser;

    next();
  }
});

const express = require("express");
const { unidadeController } = require("../../controllers/v1");
const usuarioRoutes = require("./usuarioRoutes");
const joiFactory = require("../../utils/joiFactory");
const joiSchemasV1 = require("../../utils/joiSchemasV1");
const authorizeUser = require("../../utils/authorizeUser");
const restrictUser = require("../../utils/restrictUser");

const router = express.Router();

// nested routing - /api/v1/unidade/:unidadeId/usuarios
router.use("/:unidadeId/usuarios", usuarioRoutes);

// get all - /api/v1/unidades
router.get(
  "/",
  joiFactory(joiSchemasV1.unidadeQuery.getAllUnidadesQuery, "query"),
  authorizeUser,
  restrictUser("Admin"),
  unidadeController.setGetAllUnidadesFilter,
  unidadeController.getAllUnidades
);

// create one - /api/v1/unidades
router.post(
  "/",
  joiFactory(joiSchemasV1.unidadeBody.createUnidadeBody, "body"),
  authorizeUser,
  restrictUser("Admin"),
  unidadeController.createUnidade
);

// update one - /api/v1/unidades/:id
router.patch(
  "/:id",
  joiFactory(joiSchemasV1.unidadeParams.getUnidadeIdParams, "params"),
  joiFactory(joiSchemasV1.unidadeBody.updateUnidadeBody, "body"),
  authorizeUser,
  restrictUser("Admin"),
  unidadeController.updateUnidade
);

// delete one - /api/v1/unidades/:id
router.delete(
  "/:id",
  joiFactory(joiSchemasV1.unidadeParams.getUnidadeIdParams, "params"),
  authorizeUser,
  restrictUser("Admin"),
  unidadeController.deleteUnidade
);

// unidades_signup_history - /api/v1/unidades/signup-history
router.get(
  "/signup-history",
  authorizeUser,
  restrictUser("Admin"),
  unidadeController.unidadesSignupHistory
);

module.exports = router;

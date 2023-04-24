const express = require("express");
const { usuarioController } = require("../../controllers/v1");
const pacienteRoutes = require("./pacienteRoutes");
const joiFactory = require("../../utils/joiFactory");
const joiSchemasV1 = require("../../utils/joiSchemasV1");
const authorizeUser = require("../../utils/authorizeUser");
const restrictUser = require("../../utils/restrictUser");

const router = express.Router({ mergeParams: true });

// nested routing - /api/v1/usuarios/:usuarioId/pacientes
router.use("/:usuarioId/pacientes", pacienteRoutes);

// signin - /api/v1/usuarios/signin
router.get("/signin", authorizeUser, usuarioController.signin);

// signup admin - /api/v1/usuarios/signup/admin
router.post(
  "/signup/admin",
  joiFactory(joiSchemasV1.usuarioBody.createUsuarioAdminBody, "body"),
  authorizeUser,
  restrictUser("Admin"),
  usuarioController.signupAdmin
);

// signup funcionario - /api/v1/usuarios/signup/funcionario
router.post(
  "/signup/funcionario",
  joiFactory(joiSchemasV1.usuarioBody.createUsuarioFuncionarioBody, "body"),
  authorizeUser,
  restrictUser("Admin", "Funcionario"),
  usuarioController.signupFuncionario
);

// signup medico - /api/v1/usuarios/signup/medico
router.post(
  "/signup/medico",
  joiFactory(joiSchemasV1.usuarioBody.createUsuarioMedicoBody, "body"),
  authorizeUser,
  restrictUser("Admin", "Funcionario"),
  usuarioController.signupMedico
);

// admins signup-history - /api/v1/usuarios/signup-history || /api/v1/unidades/:unidadeId/usuarios/signup-history
router.get(
  "/signup-history",
  joiFactory(joiSchemasV1.unidadeParams.getNestedUnidadeIdParams, "params"),
  joiFactory(joiSchemasV1.usuarioQuery.getAllUsuariosQuery, "query"),
  authorizeUser,
  restrictUser("Admin", "Funcionario"),
  usuarioController.usuarioSignupHistory
);

// get all - /api/v1/usuarios | /api/v1/unidades/:unidadeId/usuarios
router.get(
  "/",
  joiFactory(joiSchemasV1.unidadeParams.getNestedUnidadeIdParams, "params"),
  joiFactory(joiSchemasV1.usuarioQuery.getAllUsuariosQuery, "query"),
  authorizeUser,
  restrictUser("Admin", "Funcionario"),
  usuarioController.setGetAllUsuariosFilter,
  usuarioController.getAllUsuarios
);

// get one - /api/v1/usuarios/:id
router.get(
  "/:id",
  joiFactory(joiSchemasV1.usuarioParams.getUsuarioIdParams, "params"),
  authorizeUser,
  restrictUser("Admin", "Funcionario"),
  usuarioController.getOneUsuario
);

// update one - /api/v1/usuarios/:id
router.patch(
  "/:id",
  joiFactory(joiSchemasV1.usuarioParams.getUsuarioIdParams, "params"),
  joiFactory(joiSchemasV1.usuarioBody.updateUsuarioBody, "body"),
  authorizeUser,
  restrictUser("Admin", "Funcionario", "Medico"),
  usuarioController.updateUsuario
);

// delete one - /api/v1/usuarios/:id
router.delete(
  "/:id",
  joiFactory(joiSchemasV1.usuarioParams.getUsuarioIdParams, "params"),
  authorizeUser,
  restrictUser("Admin", "Funcionario"),
  usuarioController.deleteUsuario
);

module.exports = router;

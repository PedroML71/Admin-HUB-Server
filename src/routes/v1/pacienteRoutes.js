const express = require("express");
const { pacienteController } = require("../../controllers/v1");
const joiFactory = require("../../utils/joiFactory");
const joiSchemasV1 = require("../../utils/joiSchemasV1");
const authorizeUser = require("../../utils/authorizeUser");
const restrictUser = require("../../utils/restrictUser");

const router = express.Router({ mergeParams: true });

// get all by usuarios - /api/v1/usuarios/:usuarioId/pacientes
router.get(
  "/",
  joiFactory(joiSchemasV1.usuarioParams.getNestedUsuarioIdParams, "params"),
  joiFactory(joiSchemasV1.pacienteQuery.getAllPacientesQuery, "query"),
  authorizeUser,
  restrictUser("Medico"),
  pacienteController.setGetAllPacientesFilter,
  pacienteController.getAllPacientesByUsuario
);

// pacientes signup-history - /api/v1/usuarios/:usuarioId/pacientes/signup-history
router.get(
  "/signup-history",
  joiFactory(joiSchemasV1.usuarioParams.getNestedUsuarioIdParams, "params"),
  authorizeUser,
  restrictUser("Medico"),
  pacienteController.getPacientesSignupHistory
);

// get one - /api/v1/pacientes/:id
router.get(
  "/:id",
  joiFactory(joiSchemasV1.pacienteParams.getPacienteIdParams, "params"),
  authorizeUser,
  restrictUser("Medico"),
  pacienteController.getOnePaciente
);

// create one - /api/v1/pacientes
router.post(
  "/",
  joiFactory(joiSchemasV1.pacienteBody.createPacienteBody, "body"),
  authorizeUser,
  restrictUser("Medico"),
  pacienteController.createPaciente
);

// update one - /api/v1/pacientes/:id
router.patch(
  "/:id",
  joiFactory(joiSchemasV1.pacienteParams.getPacienteIdParams, "params"),
  joiFactory(joiSchemasV1.pacienteBody.updatePacienteBody, "body"),
  authorizeUser,
  restrictUser("Medico"),
  pacienteController.updatePaciente
);

// delete one - /api/v1/pacientes/:id
router.delete(
  "/:id",
  joiFactory(joiSchemasV1.pacienteParams.getPacienteIdParams, "params"),
  authorizeUser,
  restrictUser("Medico"),
  pacienteController.deletePaciente
);

module.exports = router;

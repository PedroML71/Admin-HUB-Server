const joi = require("joi");

const schema = {
  // params
  unidadeParams: {
    getNestedUnidadeIdParams: joi.object().keys({
      unidadeId: joi.string().guid({ version: "uuidv4" }),
    }),
    getUnidadeIdParams: joi.object().keys({
      id: joi.string().guid({ version: "uuidv4" }).required(),
    }),
  },
  usuarioParams: {
    getNestedUsuarioIdParams: joi.object().keys({
      usuarioId: joi.string().guid({ version: "uuidv4" }).required(),
    }),
    getUsuarioIdParams: joi.object().keys({
      id: joi.string().guid({ version: "uuidv4" }).required(),
    }),
  },
  pacienteParams: {
    getPacienteIdParams: joi.object().keys({
      id: joi.string().guid({ version: "uuidv4" }).required(),
    }),
  },
  // body
  unidadeBody: {
    createUnidadeBody: joi.object().keys({
      nome: joi.string().required(),
      celular: joi.string().required(),
      email: joi.string().required(),
      estado: joi.string().required(),
      cidade: joi.string().required(),
      bairro: joi.string().required(),
      numero: joi.string().required(),
      cep: joi.string().required(),
    }),
    updateUnidadeBody: joi.object().keys({
      nome: joi.string(),
      celular: joi.string(),
      email: joi.string(),
      estado: joi.string(),
      cidade: joi.string(),
      bairro: joi.string(),
      numero: joi.string(),
      cep: joi.string(),
    }),
  },
  usuarioBody: {
    createUsuarioAdminBody: joi.object().keys({
      nome: joi.string().required(),
      sobrenome: joi.string().required(),
      celular: joi.string().required(),
      email: joi.string().required(),
      password: joi.string().required(),
    }),
    createUsuarioFuncionarioBody: joi.object().keys({
      nome: joi.string().required(),
      sobrenome: joi.string().required(),
      celular: joi.string().required(),
      email: joi.string().required(),
      unidadeId: joi.string().guid({ version: "uuidv4" }).required(),
      password: joi.string().required(),
    }),
    createUsuarioMedicoBody: joi.object().keys({
      nome: joi.string().required(),
      sobrenome: joi.string().required(),
      celular: joi.string().required(),
      email: joi.string().required(),
      unidadeId: joi.string().guid({ version: "uuidv4" }).required(),
      password: joi.string().required(),
    }),
    updateUsuarioBody: joi.object().keys({
      nome: joi.string(),
      sobrenome: joi.string(),
      celular: joi.string(),
      email: joi.string(),
      imageUrl: joi.string(),
      unidadeId: joi.string().guid({ version: "uuidv4" }),
    }),
  },
  pacienteBody: {
    createPacienteBody: joi.object().keys({
      nome: joi.string().required(),
      sobrenome: joi.string().required(),
      celular: joi.string().required(),
      email: joi.string().required(),
      usuarioId: joi.string().guid({ version: "uuidv4" }).required(),
    }),
    updatePacienteBody: joi.object().keys({
      nome: joi.string(),
      sobrenome: joi.string(),
      celular: joi.string(),
      email: joi.string(),
      imageUrl: joi.string(),
    }),
  },
  // query
  unidadeQuery: {
    getAllUnidadesQuery: joi.object().keys({
      nome: joi.string().allow(null, ""),
      page: joi.alternatives().try(joi.string(), joi.number()),
      limit: joi.alternatives().try(joi.string(), joi.number()),
    }),
  },
  usuarioQuery: {
    getAllUsuariosQuery: joi.object().keys({
      nome: joi.string().allow(null, ""),
      page: joi.alternatives().try(joi.string(), joi.number()),
      limit: joi.alternatives().try(joi.string(), joi.number()),
      role: joi.string(),
    }),
  },
  pacienteQuery: {
    getAllPacientesQuery: joi.object().keys({
      nome: joi.string().allow(null, ""),
      page: joi.alternatives().try(joi.string(), joi.number()),
      limit: joi.alternatives().try(joi.string(), joi.number()),
    }),
  },
};

module.exports = schema;

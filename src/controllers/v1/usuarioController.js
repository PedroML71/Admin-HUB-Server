const { Op } = require("sequelize");
const { formatISO, subDays, subYears } = require("date-fns");
const { Usuario, Unidade } = require("../../../models");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const { auth } = require("../../../firebaseConfig");
const io = require("../../../socket");

exports.setGetAllUsuariosFilter = (req, res, next) => {
  let filter = { status: true };

  if (req.query?.nome) filter.nome = { [Op.like]: `${req.query.nome}%` };
  if (req.query?.role) filter.role = req.query.role;

  req.filter = { ...filter };
  next();
};

exports.signin = catchAsync(async (req, res, next) => {
  const refId = req.params.refId;

  const usuario = await Usuario.findOne({
    where: { status: true, codigoFire: refId },
    include: "Unidade",
  });

  if (!usuario) {
    return next(new AppError("Usuario não encontrado!", 404));
  }

  usuario.codigoFire = undefined;
  usuario.status = undefined;

  res.status(200).json({ status: "success", data: { usuario } });
});

exports.signupAdmin = catchAsync(async (req, res, next) => {
  // criar usuario no firebase
  const { email, password } = req.body;

  const response = await auth.createUser({ email, password });

  if (!response) {
    return next(new AppError("Usuario não pode ser criado!", 500));
  }

  // criar usuario no banco de dados
  const usuario = await Usuario.create({
    ...req.body,
    role: "Admin",
    codigoFire: response.uid,
  });

  // remover dados desnecessarios
  usuario.codigoFire = undefined;
  usuario.status = undefined;

  io.getIO().emit("Admin", { action: "create", user: usuario });

  res.status(201).json({ status: "success", data: usuario });
});

exports.signupFuncionario = catchAsync(async (req, res, next) => {
  // verificar existencia da Unidade associada com o Funcionario
  const unidade = await Unidade.findByPk(req.body.unidadeId);

  if (!unidade) {
    return next(new AppError("Unidade não foi encontrada!", 404));
  }

  // criar usuario no firebase
  const { email, password } = req.body;

  const response = await auth.createUser({ email, password });

  if (!response) {
    return next(new AppError("Usuario não pode ser criado!", 500));
  }

  // criar usuario no banco de dados
  const usuario = await Usuario.create({
    ...req.body,
    role: "Funcionario",
    codigoFire: response.uid,
  });

  // remover dados desnecessarios
  usuario.codigoFire = undefined;
  usuario.status = undefined;

  io.getIO().emit("Funcionario", { action: "create", user: usuario });

  res.status(201).json({
    status: "success",
    data: { ...usuario.dataValues, unidade: unidade },
  });
});

exports.signupMedico = catchAsync(async (req, res, next) => {
  // verificar existencia da Unidade associada com o Funcionario
  const unidade = await Unidade.findByPk(req.body.unidadeId);

  if (!unidade) {
    return next(new AppError("Unidade não foi encontrada!", 404));
  }

  // criar usuario no firebase
  const { email, password } = req.body;

  const response = await auth.createUser({ email, password });

  if (!response) {
    return next(new AppError("Usuario não pode ser criado!", 500));
  }

  // criar usuario no banco de dados
  const usuario = await Usuario.create({
    ...req.body,
    role: "Medico",
    codigoFire: response.uid,
  });

  // remover dados desnecessarios
  usuario.codigoFire = undefined;
  usuario.status = undefined;

  io.getIO().emit("Medico", { action: "create", user: usuario });

  res.status(201).json({
    status: "success",
    data: { ...usuario.dataValues, unidade: unidade },
  });
});

exports.getAllUsuarios = catchAsync(async (req, res) => {
  const page = req.query?.page * 1 || 1;
  const limit = req.query?.limit * 1 || 8;
  const skip = (page - 1) * limit;
  const filter = { ...req.filter };

  if (req.params?.unidadeId) {
    filter.unidadeId = req.params.unidadeId;
  }

  const usuarios = await Usuario.findAll({
    where: filter,
    order: [["createdAt", "DESC"]],
    offset: skip,
    limit: limit,
    include: "Unidade",
  });

  res.status(200).json({
    status: "success",
    results: usuarios.length,
    data: { usuarios },
  });
});

exports.getOneUsuario = catchAsync(async (req, res, next) => {
  const usuario = await Usuario.findOne({
    where: { status: true, id: req.params.id },
  });

  if (!usuario) {
    return next(new AppError("Usuario não encontrado!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      usuario,
    },
  });
});

exports.updateUsuario = catchAsync(async (req, res, next) => {
  const usuario = await Usuario.findByPk(req.params.id);

  if (!usuario) {
    return next(new AppError("Usuario não encontrado!", 404));
  }

  await usuario.update(req.body);

  const updatedUsuario = await usuario.reload();

  io.getIO().emit(`${updatedUsuario.role}`, {
    action: "update",
    user: usuario,
  });

  res.status(200).json({
    status: "success",
    data: { usuario: updatedUsuario },
  });
});

exports.deleteUsuario = catchAsync(async (req, res, next) => {
  const usuario = await Usuario.findOne({
    where: { id: req.params.id, status: true },
  });

  if (!usuario) {
    return next(new AppError("Usuario não encontrado!", 404));
  }

  await usuario.update({ status: false });

  io.getIO().emit(`${usuario.role}`, { action: "delete", user: usuario });

  res.status(204).json({ status: "success" });
});

exports.usuarioSignupHistory = catchAsync(async (req, res) => {
  const hoje = formatISO(new Date());
  const umDia = formatISO(subDays(new Date(), 1));
  const trintaDias = formatISO(subDays(new Date(), 30));
  const sessentaDias = formatISO(subDays(new Date(), 60));
  const umAno = formatISO(subYears(new Date(), 1));
  let searchParams = {};

  if (req.params?.unidadeId) searchParams.unidadeId = req.params?.unidadeId;

  const counterHoje = await Usuario.count({
    where: {
      createdAt: {
        [Op.lte]: hoje,
        [Op.gt]: umDia,
      },
      status: true,
      role: req.query.role,
      ...searchParams,
    },
  });

  const counterTrintaDias = await Usuario.count({
    where: {
      createdAt: {
        [Op.lte]: umDia,
        [Op.gt]: trintaDias,
      },
      status: true,
      role: req.query.role,
      ...searchParams,
    },
  });

  const counterSessentaDias = await Usuario.count({
    where: {
      createdAt: {
        [Op.lte]: trintaDias,
        [Op.gt]: sessentaDias,
      },
      status: true,
      role: req.query.role,
      ...searchParams,
    },
  });

  const counterUmAno = await Usuario.count({
    where: {
      createdAt: {
        [Op.lte]: sessentaDias,
        [Op.gt]: umAno,
      },
      status: true,
      role: req.query.role,
      ...searchParams,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      umDia: counterHoje,
      trintaDias: counterTrintaDias,
      sessentaDias: counterSessentaDias,
      umAno: counterUmAno,
      total:
        counterHoje + counterTrintaDias + counterSessentaDias + counterUmAno,
    },
  });
});

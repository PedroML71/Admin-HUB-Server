const { Op } = require("sequelize");
const { formatISO, subDays, subYears } = require("date-fns");
const { Paciente, Usuario } = require("../../../models");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const io = require("../../../socket");

exports.setGetAllPacientesFilter = (req, res, next) => {
  let filter = { status: true };

  if (req.query?.nome) filter.nome = { [Op.like]: `${req.query.nome}%` };

  req.filter = { ...filter };
  next();
};

exports.getAllPacientesByUsuario = catchAsync(async (req, res) => {
  const page = req.query?.page * 1 || 1;
  const limit = req.query?.limit * 1 || 8;
  const skip = (page - 1) * limit;

  const pacientes = await Paciente.findAll({
    where: { ...req.filter, usuarioId: req.params.usuarioId },
    order: [["createdAt", "DESC"]],
    offset: skip,
    limit: limit,
    include: "Usuario",
  });

  res.status(200).json({
    status: "success",
    results: pacientes.length,
    data: { pacientes },
  });
});

exports.getOnePaciente = catchAsync(async (req, res, next) => {
  const paciente = await Paciente.findOne({
    where: { status: true, id: req.params.id },
  });

  if (!paciente) {
    return next(new AppError("Paciente não encontrado!", 404));
  }

  res.status(200).json({ status: "success", data: { paciente } });
});

exports.createPaciente = catchAsync(async (req, res, next) => {
  const usuario = await Usuario.findOne({
    where: { id: req.body.usuarioId, status: true, role: "Medico" },
  });

  if (!usuario) {
    return next(new AppError("Medico não foi encontrado!", 404));
  }

  const paciente = await Paciente.create(req.body);

  io.getIO().emit("Paciente", { action: "create", paciente });

  res.status(201).json({
    status: "success",
    data: { ...paciente.dataValues, medico: usuario },
  });
});

exports.updatePaciente = catchAsync(async (req, res, next) => {
  const paciente = await Paciente.findByPk(req.params.id);

  if (!paciente) {
    return next(new AppError("Paciente não encontrado!", 404));
  }

  await paciente.update(req.body, { where: { id: req.params.id } });

  io.getIO().emit("Paciente", { action: "update", paciente });

  res.status(200).json({
    status: "success",
    data: { paciente },
  });
});

exports.deletePaciente = catchAsync(async (req, res, next) => {
  const paciente = await Paciente.findOne({
    where: { status: true, id: req.params.id },
  });

  if (!paciente) {
    return next(new AppError("Paciente não encontrado!", 404));
  }

  await paciente.update({ status: false });

  io.getIO().emit("Paciente", { action: "delete", paciente });

  res.status(204).json({ status: "success" });
});

exports.getPacientesSignupHistory = catchAsync(async (req, res) => {
  const hoje = formatISO(new Date());
  const umDia = formatISO(subDays(new Date(), 1));
  const trintaDias = formatISO(subDays(new Date(), 30));
  const sessentaDias = formatISO(subDays(new Date(), 60));
  const umAno = formatISO(subYears(new Date(), 1));

  const counterHoje = await Paciente.count({
    where: {
      createdAt: {
        [Op.lte]: hoje,
        [Op.gt]: umDia,
      },
      status: true,
      usuarioId: req.params.usuarioId,
    },
  });

  const counterTrintaDias = await Paciente.count({
    where: {
      createdAt: {
        [Op.lte]: umDia,
        [Op.gt]: trintaDias,
      },
      status: true,
      usuarioId: req.params.usuarioId,
    },
  });

  const counterSessentaDias = await Paciente.count({
    where: {
      createdAt: {
        [Op.lte]: trintaDias,
        [Op.gt]: sessentaDias,
      },
      status: true,
      usuarioId: req.params.usuarioId,
    },
  });

  const counterUmAno = await Paciente.count({
    where: {
      createdAt: {
        [Op.lte]: sessentaDias,
        [Op.gt]: umAno,
      },
      status: true,
      usuarioId: req.params.usuarioId,
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

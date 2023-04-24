const { Op, Sequelize } = require("sequelize");
const { formatISO, subDays, subYears } = require("date-fns");
const { Unidade } = require("../../../models");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const io = require("../../../socket");

exports.setGetAllUnidadesFilter = (req, res, next) => {
  let filter = { status: true };

  if (req.query?.nome) filter.nome = { [Op.like]: `${req.query.nome}%` };

  req.filter = { ...filter };
  next();
};

exports.getAllUnidades = catchAsync(async (req, res) => {
  const page = req.query?.page * 1 || 1;
  const limit = req.query?.limit * 1 || 8;
  const skip = (page - 1) * limit;

  const unidades = await Unidade.findAll({
    where: req.filter,
    attributes: {
      include: [
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM usuarios AS u WHERE u.unidadeId=unidade.id AND u.role='Funcionario' AND u.status=1)"
          ),
          "funcionariosCount",
        ],
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM usuarios AS u WHERE u.unidadeId=unidade.id AND u.role='Medico' AND u.status=1)"
          ),
          "medicosCount",
        ],
      ],
    },
    order: [["createdAt", "DESC"]],
    offset: skip,
    limit: limit,
  });

  res.status(200).json({
    status: "success",
    results: unidades.length,
    data: { unidades },
  });
});

exports.createUnidade = catchAsync(async (req, res) => {
  const unidade = await Unidade.create(req.body);

  io.getIO().emit("Unidade", { action: "create", unidade });

  res.status(201).json({ status: "success", data: { unidade } });
});

exports.updateUnidade = catchAsync(async (req, res, next) => {
  const unidade = await Unidade.findByPk(req.params.id);

  if (!unidade) {
    return next(new AppError("Unidade não foi encontrada!", 404));
  }

  await unidade.update(req.body);

  const updatedUnidade = await unidade.reload();

  io.getIO().emit("Unidade", { action: "update", unidade });

  res
    .status(200)
    .json({ status: "success", data: { unidade: updatedUnidade } });
});

exports.deleteUnidade = catchAsync(async (req, res, next) => {
  const unidade = await Unidade.findOne({
    where: { id: req.params.id, status: true },
  });

  if (!unidade) {
    return next(new AppError("Unidade não foi encontrada!", 404));
  }

  await unidade.update({ status: false });

  io.getIO().emit("Unidade", { action: "delete", unidade });

  res.status(204).json({ status: "success" });
});

exports.unidadesSignupHistory = catchAsync(async (req, res) => {
  const hoje = formatISO(new Date());
  const umDia = formatISO(subDays(new Date(), 1));
  const trintaDias = formatISO(subDays(new Date(), 30));
  const sessentaDias = formatISO(subDays(new Date(), 60));
  const umAno = formatISO(subYears(new Date(), 1));

  const counterHoje = await Unidade.count({
    where: {
      createdAt: {
        [Op.lte]: hoje,
        [Op.gt]: umDia,
      },
      status: true,
    },
  });

  const counterTrintaDias = await Unidade.count({
    where: {
      createdAt: {
        [Op.lte]: umDia,
        [Op.gt]: trintaDias,
      },
      status: true,
    },
  });

  const counterSessentaDias = await Unidade.count({
    where: {
      createdAt: {
        [Op.lte]: trintaDias,
        [Op.gt]: sessentaDias,
      },
      status: true,
    },
  });

  const counterUmAno = await Unidade.count({
    where: {
      createdAt: {
        [Op.lte]: sessentaDias,
        [Op.gt]: umAno,
      },
      status: true,
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

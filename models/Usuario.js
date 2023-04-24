module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define("Usuario", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^[a-zA-Z]+$/i,
      },
    },

    sobrenome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^[a-zA-Z]+$/i,
      },
    },

    celular: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^[0-9()-]*$/i,
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },

    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["Admin", "Funcionario", "Medico"],
      validate: {
        notEmpty: true,
      },
    },

    codigoFire: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },

    imageUrl: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        notEmpty: true,
      },
    },
  });

  Usuario.associate = (models) => {
    Usuario.belongsTo(models.Unidade, {
      foreignKey: {
        name: "unidadeId",
        allowNull: true,
      },
    });

    Usuario.hasMany(models.Paciente, {
      foreignKey: {
        name: "usuarioId",
        allowNull: true,
      },
    });
  };

  return Usuario;
};

module.exports = (sequelize, DataTypes) => {
  const Paciente = sequelize.define("Paciente", {
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

  Paciente.associate = (models) => {
    Paciente.belongsTo(models.Usuario, {
      foreignKey: {
        name: "usuarioId",
        allowNull: true,
      },
    });
  };

  return Paciente;
};

module.exports = (sequelize, DataTypes) => {
  const Unidade = sequelize.define("Unidade", {
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
        is: /^\w+( \w+)*$/i,
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

    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^[a-zA-Z]+$/i,
      },
    },

    cidade: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^\w+( \w+)*$/i,
      },
    },

    bairro: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^\w+( \w+)*$/i,
      },
    },

    numero: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^\w+( \w+)*$/i,
      },
    },

    cep: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^[0-9-]+$/i,
      },
    },

    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  Unidade.associate = (models) => {
    Unidade.hasMany(models.Usuario, {
      foreignKey: {
        name: "unidadeId",
        allowNull: true,
      },
    });
  };

  return Unidade;
};

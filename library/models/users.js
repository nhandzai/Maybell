'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      this.hasMany(models.reviews, { foreignKey: 'usersId', onDelete: 'CASCADE' });
      this.hasMany(models.orders, { foreignKey: 'usersId', onDelete: 'CASCADE' });
      this.hasMany(models.carts, { foreignKey: 'usersId', onDelete: 'CASCADE' });
      this.hasMany(models.wishlists, { foreignKey: 'usersId', onDelete: 'CASCADE' });
    }
  }

  users.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'users',
    timestamps: true,
  });

  return users;
};

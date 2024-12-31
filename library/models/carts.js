'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class carts extends Model {
    static associate(models) {
      this.belongsTo(models.users, { foreignKey: 'userId' });
      this.belongsTo(models.products, { foreignKey: 'productId' });
    }
  }

  carts.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'carts',
    timestamps: true,
  });

  return carts;
};

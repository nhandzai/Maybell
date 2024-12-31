'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class orderProducts extends Model {
    static associate(models) {
      this.belongsTo(models.orders, { foreignKey: 'orderId' });
      this.belongsTo(models.products, { foreignKey: 'productId' });
    }
  }

  orderProducts.init({
    orderId: {
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
    modelName: 'orderProducts',
    timestamps: true,
  });

  return orderProducts;
};

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class cartProducts extends Model {
    static associate(models) {
      this.belongsTo(models.carts, { foreignKey: 'cartId', onDelete: 'CASCADE' });
      this.belongsTo(models.products, { foreignKey: 'productId', onDelete: 'CASCADE' });
    }
  }

  cartProducts.init({
    cartId: {
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
    modelName: 'cartProducts',
    tableName: 'cartProducts',
    timestamps: true,
  });

  return cartProducts;
};

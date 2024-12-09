'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    static associate(models) {
      this.belongsTo(models.users, { foreignKey: 'userId', onDelete: 'CASCADE' });
      this.belongsTo(models.carts, { foreignKey: 'cartId', onDelete: 'SET NULL' });
    }
  }

  orders.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    cartId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'carts',
        key: 'id',
      },
      onDelete: 'SET NULL',
      allowNull: true,
    },
    totalPrice: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'orders',
    timestamps: true,
  });

  return orders;
};

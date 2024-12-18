'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    static associate(models) {
      this.belongsTo(models.users, { foreignKey: 'userId', onDelete: 'CASCADE' });
      this.belongsTo(models.carts, { foreignKey: 'cartId', onDelete: 'CASCADE' });
    }
  }

  orders.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'orders',
    tableName: 'orders',
    timestamps: true,
  });

  return orders;
};

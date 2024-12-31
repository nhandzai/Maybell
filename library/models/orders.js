'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    static associate(models) {
      this.belongsTo(models.users, { foreignKey: 'userId' });
      this.belongsTo(models.paymentMethods, { foreignKey: 'paymentMethodId' });
      this.hasMany(models.orderProducts, { foreignKey: 'orderId' });
    }
  }

  orders.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentMethodId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'orders',
    timestamps: true,
  });

  return orders;
};

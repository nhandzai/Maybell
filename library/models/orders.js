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
    
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'orders',
    timestamps: true,
  });

  return orders;
};

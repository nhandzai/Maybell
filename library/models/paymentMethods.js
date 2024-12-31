'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class paymentMethods extends Model {
    static associate(models) {
      this.hasMany(models.orders, { foreignKey: 'paymentMethodId' });
    }
  }

  paymentMethods.init({
    methodName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'paymentMethods',
    timestamps: true,
  });

  return paymentMethods;
};

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class brands extends Model {
    static associate(models) {
      this.hasMany(models.products, { foreignKey: 'brandId' });
    }
  }

  brands.init({
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'brands',
    timestamps: true,
  });

  return brands;
};

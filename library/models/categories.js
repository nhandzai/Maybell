'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    static associate(models) {
      this.hasMany(models.products, { foreignKey: 'categoryId' });
    }
  }

  categories.init({
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'categories',
    timestamps: true,
  });

  return categories;
};

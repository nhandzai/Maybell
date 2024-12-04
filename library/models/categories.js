'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    static associate(models) {
      this.belongsTo(models.products, { foreignKey: 'productId', onDelete: 'CASCADE' });
    }
  }

  categories.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    category: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'categories',
    timestamps: true,
  });

  return categories;
};

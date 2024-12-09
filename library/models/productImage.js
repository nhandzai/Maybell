'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class productImages extends Model {
    static associate(models) {
      this.belongsTo(models.products, { foreignKey: 'productId', onDelete: 'CASCADE' });
    }
  }

  productImages.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    image: DataTypes.STRING,
    isMain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'productImages',
    timestamps: true,
  });

  return productImages;
};

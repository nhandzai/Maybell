'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class productSizes extends Model {
    static associate(models) {
     
      this.belongsTo(models.products, { foreignKey: 'productId', onDelete: 'CASCADE' });
   
      this.belongsTo(models.sizes, { foreignKey: 'sizeId', onDelete: 'CASCADE' });
    }
  }

  productSizes.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    sizeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sizes',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'productSizes',
  });

  return productSizes;
};

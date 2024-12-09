'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class sizes extends Model {
    static associate(models) {
    
      this.belongsToMany(models.products, {
        through: models.productSizes,
        foreignKey: 'sizeId',
        otherKey: 'productId',
        onDelete: 'CASCADE'
      });
    }
  }

  sizes.init({
    size: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'sizes',
  });

  return sizes;
};

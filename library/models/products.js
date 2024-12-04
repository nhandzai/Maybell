'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class products extends Model {
   
    static associate(models) {

    this.hasMany(models.productSizes, { foreignKey: 'productId', onDelete: 'CASCADE' });
    this.hasMany(models.productImages, { foreignKey: 'productId', onDelete: 'CASCADE' });
    this.hasMany(models.reviews, { foreignKey: 'productId', onDelete: 'CASCADE' });
    this.hasMany(models.carts, { foreignKey: 'productId', onDelete: 'CASCADE' });
    this.hasMany(models.wishlists, { foreignKey: 'productId', onDelete: 'CASCADE' });
    this.hasMany(models.categories, { foreignKey: 'productId', onDelete: 'CASCADE' });
    }
  }

  products.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,

    shortDescription: DataTypes.TEXT,
    detail: DataTypes.TEXT,
    material: DataTypes.STRING,
    weightKg: DataTypes.FLOAT,
    stockQuantity: DataTypes.INTEGER,
    realPrice: DataTypes.FLOAT,
    brand: DataTypes.STRING,

    promotion: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.price && this.realPrice) {
          return (((this.price - this.realPrice) / this.price) * 100).toFixed(2);
        }
        return this.price;
      }
    }
  }, {
    sequelize,
    modelName: 'products',
  });

  return products;
};



'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    static associate(models) {
      this.hasMany(models.productImages, { foreignKey: 'productId', onDelete: 'CASCADE' });
      this.hasMany(models.reviews, { foreignKey: 'productId', onDelete: 'CASCADE' });
  
      this.hasMany(models.carts, { foreignKey: 'productId', onDelete: 'CASCADE' });
      this.hasMany(models.wishlists, { foreignKey: 'productId', onDelete: 'CASCADE' });
      this.belongsTo(models.categories, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
      this.belongsTo(models.brands, { foreignKey: 'brandId', onDelete: 'SET NULL' });

    
      this.belongsToMany(models.sizes, {
        through: models.productSizes,
        foreignKey: 'productId',
        otherKey: 'sizeId',
        onDelete: 'CASCADE'
      });
    }
  }

  products.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    shortDescription: DataTypes.TEXT,
    detail: DataTypes.TEXT,
    material: DataTypes.STRING,
    weightKg: DataTypes.FLOAT,
    realPrice: DataTypes.FLOAT,
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'brands',
        key: 'id',
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    stockQuantity: DataTypes.INTEGER,
    status: {
      type: DataTypes.TEXT,
   
    },

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

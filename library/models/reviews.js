'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class reviews extends Model {
    static associate(models) {
      this.belongsTo(models.products, { foreignKey: 'productId', onDelete: 'CASCADE' });
      this.belongsTo(models.users, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  }

  reviews.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'reviews',
    timestamps: true,
  });

  return reviews;
};

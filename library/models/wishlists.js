'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class wishlists extends Model {
    static associate(models) {
      this.belongsTo(models.users, { foreignKey: 'userId', onDelete: 'CASCADE' });
      this.belongsTo(models.products, { foreignKey: 'productId', onDelete: 'CASCADE' });
    }
  }

  wishlists.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'wishlists',
    timestamps: true,
  });

  return wishlists;
};

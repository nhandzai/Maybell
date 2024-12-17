'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class carts extends Model {
    static associate(models) {
      this.belongsTo(models.users, { foreignKey: 'userId', onDelete: 'CASCADE' });
      this.belongsTo(models.products, { foreignKey: 'productId', onDelete: 'CASCADE' });
      //this.belongsTo(models.carts, { foreignKey: 'cartId', onDelete: 'SET NULL' });
      this.hasOne(models.orders, { foreignKey: 'cartId', onDelete: 'SET NULL' });
    }
  }

  carts.init({
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    sequelize,
    modelName: 'carts',
    timestamps: true,
  });

  return carts;
};

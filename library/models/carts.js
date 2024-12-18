'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class carts extends Model {
    static associate(models) {
      this.belongsTo(models.users, { foreignKey: 'userId', onDelete: 'CASCADE' });
      this.hasMany(models.cartProducts, { foreignKey: 'cartId', onDelete: 'CASCADE' });
    }
  }

  carts.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue:true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'carts',
    tableName: 'carts',
    timestamps: true,
  });

  return carts;
};

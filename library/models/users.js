'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      this.hasMany(models.reviews, { foreignKey: 'userId', onDelete: 'CASCADE' });
      this.hasMany(models.orders, { foreignKey: 'userId', onDelete: 'CASCADE' });
      this.hasMany(models.carts, { foreignKey: 'userId', onDelete: 'CASCADE' });
      this.hasMany(models.wishlists, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  }

  users.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,  // Password có thể là NULL
    },
    isAdmin: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,  
    },
    sex: {
      type: DataTypes.ENUM('Male', 'Female'),
      allowNull: true,  
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,  
    },
    googleId: {  // Thêm trường googleId
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {  // Thêm trường isVerified
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    avatar: {  // Thêm trường avatar (URL ảnh)
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'users',
    timestamps: true,
  });

  return users;
};

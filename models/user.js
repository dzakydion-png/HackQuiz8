"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profile, { foreignKey: "userId" });

     //relasi Many-to-Many ke Category
      User.belongsToMany(models.Category, { 
        through: models.UserCategory,
        foreignKey: "userId"
      });
    }

    // Static method untuk ambil semua user
    static async getAllUsers() {
      return await User.findAll();
    }

    // Static method untuk ambil user by role
    static async getUsersByRole(role) {
      return await User.findAll({ where: { role } });
    }

    // Static method untuk ambil user by email
    static async getUserByEmail(email) {
      return await User.findOne({ where: { email } });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: " Email sudah terdaftar!" },
        validate: {
          notEmpty: { msg: " Email tidak boleh kosong!" },
          isEmail: { msg: " Format email tidak valid!" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: " Password tidak boleh kosong!" },
          len: { args: [8], msg: " Password minimal 8 karakter!" },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: " Role tidak boleh kosong!" },
          isIn: {
            args: [["student", "teacher"]],
            msg: " Role hanya boleh student atau teacher!",
          },
        },
      },
    },
    {
      // hooks untuk hash password sebelum create
      hooks: {
        beforeCreate: (user) => {
          if (user.password) {
            user.password = bcrypt.hashSync(user.password, 10);
          }
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};

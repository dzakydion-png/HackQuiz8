"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Course, { foreignKey: "categoryId" });

      // relasi Many-to-Many ke User
      Category.belongsToMany(models.User, {
        through: models.UserCategory,
        foreignKey: "categoryId"
      });
    }
    

    // Static method untuk ambil semua category dengan course
    static async getAllWithCourses() {
      const { Course } = require("./index");
      return await Category.findAll({
        include: [Course],
      });
    }
  }

  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Category",
    }
  );

  return Category;
};

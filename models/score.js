"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    static associate(models) {
      Score.belongsTo(models.User, { foreignKey: "userId" });
      Score.belongsTo(models.Exercise, { foreignKey: "exerciseId" });
    }

    // Static method untuk ambil score by user
    static async getScoresByUser(userId) {
      const { User, Exercise } = require("./index");
      return await Score.findAll({
        where: { userId },
        include: [User, Exercise],
      });
    }
    // getter untuk nilaiFinal
    get nilaiFinal() {
      return (this.finalScore || 0) * 10;
    }
  }

  Score.init(
    {
      userId: DataTypes.INTEGER,
      exerciseId: DataTypes.INTEGER,
      finalScore: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Score",
    }
  );

  return Score;
};

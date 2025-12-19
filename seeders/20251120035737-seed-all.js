"use strict";
const fs = require("fs").promises;
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    let seedUser = JSON.parse(
      await fs.readFile("./data/user.json", "utf8")
    ).map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      el.password = bcrypt.hashSync(el.password, 10);

      return el;
    });
    let seedCourses = JSON.parse(
      await fs.readFile("./data/courses.json", "utf8")
    ).map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      
      return el;
    });

    let seedCategory = JSON.parse(
      await fs.readFile("./data/category.json", "utf8")
    ).map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });

    let seedExercise = JSON.parse(
      await fs.readFile("./data/exercise.json", "utf8")
    ).map((el) => {
      delete el.id;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });

    let seedUserCategory = JSON.parse(
      await fs.readFile("./data/userCategory.json", "utf8")
    ).map((el) => {
      delete el.id;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });

    let seedScore = JSON.parse(
      await fs.readFile("./data/score.json", "utf8")
    ).map((el) => {
      delete el.id;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });

    await queryInterface.bulkInsert("Users", seedUser);
    await queryInterface.bulkInsert("Categories", seedCategory);
    await queryInterface.bulkInsert("Courses", seedCourses);
    await queryInterface.bulkInsert("Exercises", seedExercise);
    await queryInterface.bulkInsert("UserCategories", seedUserCategory);
    await queryInterface.bulkInsert("Scores", seedScore);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Scores", null, {});
    await queryInterface.bulkDelete("UserCategories", null, {});
    await queryInterface.bulkDelete("Exercises", null, {});
    await queryInterface.bulkDelete("Courses", null, {});
    await queryInterface.bulkDelete("Categories", null, {});
    await queryInterface.bulkDelete("Profiles", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};

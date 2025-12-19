'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Exercises', {
      id: { 
        type: Sequelize.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
      },
      question: { 
        type: Sequelize.TEXT, 
        allowNull: false 
      },
      answerKey: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      courseId: {
        type: Sequelize.INTEGER,
        references: { model: 'Courses', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false
      },
      createdAt: { 
        type: Sequelize.DATE, 
        allowNull: false 
      },
      updatedAt: { 
        type: Sequelize.DATE, 
        allowNull: false 
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Exercises');
  }
};

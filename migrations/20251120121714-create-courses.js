'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      id: { 
        type: Sequelize.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
      },
      name: { 
        type: Sequelize.STRING, 
        allowNull: false },
        description: { 
        type: Sequelize.TEXT, 
        allowNull: false 
      },
      duration: { 
        type: Sequelize.INTEGER, 
        allowNull: false 
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: { model: 'Categories', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
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
    await queryInterface.dropTable('Courses');
  }
};

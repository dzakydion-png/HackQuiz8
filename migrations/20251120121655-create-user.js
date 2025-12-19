'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: { 
        type: Sequelize.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
      },
      email: { 
        type: Sequelize.STRING, 
        allowNull: false, 
        unique: true 
      },
      password: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      role: { 
        type: Sequelize.STRING, 
        allowNull: false, 
        defaultValue: 'student' 
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
    await queryInterface.dropTable('Users');
  }
};

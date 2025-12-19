// seeders/xxxx-add-master-teachers.js
const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("rahasia123", salt); // Password guru

    await queryInterface.bulkInsert('Users', [{
      email: 'guru@sekolah.id',
      password: hash,
      role: 'teacher', // <--- Disini kita set role teacher manual
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { email: 'guru@sekolah.id' }, {});
  }
};
'use strict';

// /** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {

    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'john.smith@gmail.com',
        username: 'JohnSmith',
        hashedPassword: bcrypt.hashSync('johnsmith'),
        firstName: 'John',
        lastName: 'Smith'
      },
      {
        email: 'emily.vu@yahoo.com',
        username: 'EmilyVu',
        hashedPassword: bcrypt.hashSync('emilyvu'),
        firstName: 'Emily',
        lastName: 'Vu'
      },
      {
        email: 'cris.dan@gmail.com',
        username: 'CrisDan',
        hashedPassword: bcrypt.hashSync('crisdan'),
        firstName: 'Cris',
        lastName: 'Dan'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {

    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['JohnSmith', 'EmilyVu', 'CrisDan'] }
    }, {});
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {

    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        startDate: new Date('2022-12-25'),
        endDate: new Date('2023-01-01')
      },
      {
        spotId: 2,
        userId: 3,
        startDate: new Date('2023-02-15'),
        endDate: new Date('2023-02-17')
      },
      {
        spotId: 3,
        userId: 1,
        startDate: new Date('2022-12-29'),
        endDate: new Date('2023-03-30')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};

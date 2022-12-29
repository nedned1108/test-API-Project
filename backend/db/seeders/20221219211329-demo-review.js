'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {

    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 2,
        userId: 1,
        review: 'Totally love this house, definitely coming back',
        stars: 5,
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Not really like the set up, house is a little bit messy',
        stars: 3,
      },
      {
        spotId: 3,
        userId: 2,
        review: 'I do not like it',
        stars: 1,
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {

    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'https://i.pinimg.com/564x/7d/51/98/7d5198a1bee92cdcba39843c2ed3ab08.jpg'
      },
      {
        reviewId: 2,
        url: 'https://i.pinimg.com/564x/60/b6/df/60b6df7ff00da077baf87ed8aa72bd06.jpg'
      },
      {
        reviewId: 3,
        url: 'https://i.pinimg.com/564x/eb/3a/66/eb3a66d4b9404c5222d8aad24bb7a492.jpg'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};

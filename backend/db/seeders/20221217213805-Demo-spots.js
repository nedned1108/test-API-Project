'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {

    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
      },
      {
        ownerId: 2,
        address: "4883 Camaron Drive",
        city: "Atlanta",
        state: "Georgia",
        country: "United States of America",
        lat: 159.24356728,
        lng: -122.47303274,
        name: "Eddie",
        description: "Home sweet home",
        price: 553,
      },
      {
        ownerId: 3,
        address: "321 This Way",
        city: "Dallas",
        state: "Texas",
        country: "United States of America",
        lat: 456.7645358,
        lng: -67.4734567,
        name: "My brain",
        description: "No way this is a house",
        price: 456,
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {

    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};

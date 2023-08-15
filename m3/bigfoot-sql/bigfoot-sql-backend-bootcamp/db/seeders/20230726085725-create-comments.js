"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert("comments", [
      {
        sighting_id: 1,
        content: "Wow that sounds so scary I hope you are safe",
        created_at: "2023-07-26T09:01:38.930Z",
        updated_at: "2023-07-26T09:01:38.930Z",
      },
      {
        sighting_id: 2,
        content: "That is terrifying I am so sorrry that happened",
        created_at: "2023-07-26T09:01:38.930Z",
        updated_at: "2023-07-26T09:01:38.930Z",
      },
      {
        sighting_id: 3,
        content: "I would have called the police",
        created_at: "2023-07-26T09:01:38.930Z",
        updated_at: "2023-07-26T09:01:38.930Z",
      },
      {
        sighting_id: 1,
        content: "So long as you managed to post about it",
        created_at: "2023-07-26T09:01:38.930Z",
        updated_at: "2023-07-26T09:01:38.930Z",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("comments", null, {});
  },
};

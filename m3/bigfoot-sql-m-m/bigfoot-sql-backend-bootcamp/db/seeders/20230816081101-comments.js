"use strict";
// Develop a new seeder file to generate some comments for the application
// Respect camel casing

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
        sightingId: 1,
        content: "Wow that sounds so scary I hope you are safe",
        createdAt: "2023-07-26T09:01:38.930Z",
        updatedAt: "2023-07-26T09:01:38.930Z",
      },
      {
        sightingId: 2,
        content: "That is terrifying I am so sorrry that happened",
        createdAt: "2023-07-26T09:01:38.930Z",
        updatedAt: "2023-07-26T09:01:38.930Z",
      },
      {
        sightingId: 3,
        content: "I would have called the police",
        createdAt: "2023-07-26T09:01:38.930Z",
        updatedAt: "2023-07-26T09:01:38.930Z",
      },
      {
        sightingId: 1,
        content: "So long as you managed to post about it",
        createdAt: "2023-07-26T09:01:38.930Z",
        updatedAt: "2023-07-26T09:01:38.930Z",
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

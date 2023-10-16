"use strict";
// Alter the sightings table to align with exercise, rename columns and add new ones in
// Camel Casing to respect JS syntax

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("sightings", "city", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("sightings", "country", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.renameColumn(
      "sightings",
      "location",
      "locationDescription"
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn("sightings", "city");
    await queryInterface.removeColumn("sightings", "country");
    await queryInterface.renameColumn(
      "sightings",
      "locationDescription",
      "location"
    );
  },
};

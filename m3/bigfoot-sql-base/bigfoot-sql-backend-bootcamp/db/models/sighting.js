// Model to get data out of the sightings table
// Camel Casing to respect JS syntax
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sighting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  Sighting.init(
    {
      date: DataTypes.DATE,
      locationDescription: DataTypes.STRING,
      notes: DataTypes.TEXT,
      city: DataTypes.TEXT,
      country: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "sighting",
    }
  );
  return Sighting;
};

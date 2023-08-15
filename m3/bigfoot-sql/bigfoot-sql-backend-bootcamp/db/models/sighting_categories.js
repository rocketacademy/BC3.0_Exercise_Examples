"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sighting_Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.sighting);
      this.belongsTo(models.category);
    }
  }
  Sighting_Categories.init(
    {
      // sighting_id: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     model: "sighting",
      //     key: "id",
      //   },
      // },
      // needed to fix migration for this to work?
      // category_id: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     model: "category",
      //     key: "id",
      //   },
      // },
    },
    {
      sequelize,
      modelName: "sighting_categories",
      underscored: true,
    }
  );
  return Sighting_Categories;
};

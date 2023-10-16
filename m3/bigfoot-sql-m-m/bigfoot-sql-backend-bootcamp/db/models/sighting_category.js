// Model to get data out of the sighting_category table
// defined associations
// tables are made with underscores in migration, notice how we handle that in our model file ( all other models do not use underscored: true )
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sighting_Category extends Model {
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
  Sighting_Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sightingId: {
        type: DataTypes.INTEGER,
        references: {
          model: "sighting",
          key: "id",
        },
      },
      intensity: {
        type: DataTypes.STRING,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: "category",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "sighting_category",
      underscored: true,
      tableName: "sighting_category",
    }
  );
  return Sighting_Category;
};

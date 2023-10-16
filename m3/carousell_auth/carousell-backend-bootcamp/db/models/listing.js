// Model to get data out of the listing table
// defined associations
// tables are made with underscores in migration, notice how we handle that in our model file ( all other models do not use underscored: true )
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Listing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // Using aliases in this example as we refer to the same table, usersId.
    static associate(models) {
      this.belongsTo(models.user, { as: "buyer", foreignKey: "buyerId" });
      this.belongsTo(models.user, { as: "seller", foreignKey: "sellerId" });
    }
  }
  Listing.init(
    {
      title: DataTypes.STRING,
      category: DataTypes.STRING,
      condition: DataTypes.STRING,
      price: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      shippingDetails: DataTypes.TEXT,
      buyerId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      sellerId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "listing",
      underscored: true,
    }
  );
  return Listing;
};

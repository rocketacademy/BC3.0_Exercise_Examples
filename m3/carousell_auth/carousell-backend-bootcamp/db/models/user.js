// Model to get data out of the users table
// defined associations
// tables are made with underscores in migration, notice how we handle that in our model file ( all other models do not use underscored: true )
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Using aliases in this example as we refer to the same table, usersId.
      this.hasMany(models.listing, { as: "buyer", foreignKey: "buyerId" });
      this.hasMany(models.listing, { as: "seller", foreignKey: "sellerId" });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      phoneNum: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
      underscored: true,
    }
  );
  return User;
};

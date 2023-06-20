'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shippings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  shippings.init({
    company_name: DataTypes.STRING,
    fee_shippings: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'shippings',
  });
  return shippings;
};
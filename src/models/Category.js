const { getDB } = require("../config/env");
const sequelize = getDB();
const { Model, DataTypes } = require("sequelize");

class Category extends Model {
  static associate(models) {
    //   this.hasMany(models.Membership, { foreignKey: 'id_account' });
    //   this.hasMany(models.Content, { foreignKey: 'id_account' });
    //   this.hasMany(models.Saldo, { foreignKey: 'id_account' });
  }
}
Category.init(
  {
    id_category: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false
    },
    categoryName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    categoryDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false,
    modelName: "Category",
    tableName: "category",
  }
);

module.exports = Category;


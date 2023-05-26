const { getDB } = require("../config/env");
const sequelize = getDB();
const { Model, DataTypes } = require("sequelize");

class Products extends Model {
  static associate(models) {
    //   this.hasMany(models.Membership, { foreignKey: 'id_account' });
    //   this.hasMany(models.Content, { foreignKey: 'id_account' });
    //   this.hasMany(models.Saldo, { foreignKey: 'id_account' });
  }
}
Products.init(
  {
    id_product: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false
    },
    id_supplier: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false
    },
    id_category: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false
    },
    sku: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    productName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    productDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    productPrice: {
      type: DataTypes.INTEGER(30),
      allowNull: false
    },
    productQuantity: {
      type: DataTypes.INTEGER(30),
      allowNull: false
    },
    productPicture: {
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
    modelName: "Products",
    tableName: "products",
  }
);

module.exports = Products;


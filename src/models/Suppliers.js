const { getDB } = require("../config/env");
const sequelize = getDB();
const { Model, DataTypes } = require("sequelize");

class Suppliers extends Model {
    static associate(models){
    //   this.hasMany(models.Membership, { foreignKey: 'id_account' });
    //   this.hasMany(models.Content, { foreignKey: 'id_account' });
    //   this.hasMany(models.Saldo, { foreignKey: 'id_account' });
    }
  }
Suppliers.init(
    {
     id_supplier: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false
        },
    companyName: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
    companyLogo:{
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
      modelName: "Suppliers",
      tableName: "suppliers",
    }
  );
  
module.exports = Suppliers;
  
  
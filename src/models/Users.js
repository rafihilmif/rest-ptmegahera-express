const { getDB } = require("../config/env");
const sequelize = getDB();
const { Model, DataTypes } = require("sequelize");

class Users extends Model {
    static associate(models){
    //   this.hasMany(models.Membership, { foreignKey: 'id_account' });
    //   this.hasMany(models.Content, { foreignKey: 'id_account' });
    //   this.hasMany(models.Saldo, { foreignKey: 'id_account' });
    }
  }
Users.init(
    {
      id_user: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false
        },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      firstName:{
        type: DataTypes.STRING(255),
        allowNull: false
      },
      lastName: {
       type: DataTypes.STRING(255),
        allowNull: false
        },
      birthdate: {
       type: DataTypes.DATE,
        allowNull: false
        },
      address: {
       type: DataTypes.STRING(255),
        allowNull: false
        },
      city: {
       type: DataTypes.STRING(255),
        allowNull: false
        },
      province: {
       type: DataTypes.STRING(255),
        allowNull: false
        },
      phone: {
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
      modelName: "Users",
      tableName: "users",
    }
  );
  
module.exports = Users;
  
  
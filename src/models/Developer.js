const { getDB } = require("../config/env");
const sequelize = getDB();
const { Model, DataTypes } = require("sequelize");

class Developer extends Model {
    static associate(models) {
    }
}
Developer.init(
    {
        id_developer: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        username:{
            type: DataTypes.STRING(255),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        balance: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        modelName: "Developer",
        tableName: "developer",
    }
);

module.exports = Developer;


const { getDB } = require("../config/env");
const sequelize = getDB();
const { Model, DataTypes } = require("sequelize");

class Shipping extends Model {
    static associate(models) {
    }
}
Shipping.init(
    {
        id_shipping: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false
        },
        companyName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        feeShipping: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE(),
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE(),
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        modelName: "Shipping",
        tableName: "shippings",
    }
);
module.exports = Shipping;


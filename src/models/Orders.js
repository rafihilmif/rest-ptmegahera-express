const { getDB } = require("../config/env");
const sequelize = getDB();
const { Model, DataTypes } = require("sequelize");

class Orders extends Model {
    static associate(models) {
        //   this.hasMany(models.Membership, { foreignKey: 'id_account' });
        //   this.hasMany(models.Content, { foreignKey: 'id_account' });
        //   this.hasMany(models.Saldo, { foreignKey: 'id_account' });
    }
}
Orders.init(
    {
        id_order: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false
        },
        id_user: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        courier: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        deliverType: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        deliverFee: {
            type: DataTypes.INTEGER(13),
            allowNull: false
        },
        city: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        zipCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(16),
            allowNull: false
        },
        total: {
            type: DataTypes.INTEGER(13),
            allowNull: false
        },
        note: {
            type: DataTypes.TEXT(),
            allowNull: false
        }
        ,
        status: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        modelName: "Orders",
        tableName: "orders",
    }
);

module.exports = Orders;


const { getDB } = require("../config/env");
const sequelize = getDB();
const { Model, DataTypes } = require("sequelize");

class Cart extends Model {
    static associate(models) {
        //   this.hasMany(models.Membership, { foreignKey: 'id_account' });
        //   this.hasMany(models.Content, { foreignKey: 'id_account' });
        //   this.hasMany(models.Saldo, { foreignKey: 'id_account' });
    }
}
Cart.init(
    {
        id_cart: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false
        },
        id_user: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        id_product: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        productName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        productPrice: {
            type: DataTypes.INTEGER(30),
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER(30),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE(),
            allowNull: false
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "Cart",
        tableName: "carts",
    }
);

module.exports = Cart;


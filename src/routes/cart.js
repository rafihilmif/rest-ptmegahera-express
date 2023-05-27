const { response } = require("express");
const express = require("express");
const { Op, Sequelize } = require("sequelize");
const User = require("../models/Users");
const Products = require("../models/Products");
const Cart = require("../models/Cart");

const Joi = require("joi");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const JWT_KEY = 'ptmegaheragunakarya';

const checkProductAvailable = async (name) => {

    const productName = await Products.findOne(
        {
            where: {
                productName: {
                    [Op.like]: name
                }
            }
        }
    );
    if (!productName) {
        throw new Error("product not found!")
    }
};
const checkStock = async (quantity) => {

    const productStock = await Products.findOne(
        {
            where: {
                productQuantity: {
                    [Op.lt]: quantity
                }
            }
        }
    );
    if (productStock) {
        throw new Error("out of stock!")
    }
};
//ADD CART WITH ROLE CUSTOMER
router.post('/add/cart', async function (req, res) {
    let { name, quantity } = req.body;
    const schema = Joi.object({
        name: Joi.string().external(checkProductAvailable).required(),
        quantity: Joi.number().external(checkStock).required()
    });
    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(400).send(error.toString())
    }
    let token = req.header('x-auth-token');
    let userdata = jwt.verify(token, JWT_KEY);
    const userMatch = await User.findAll({
        where: {
            id_user: {
                [Op.like]: userdata.id_user
            }
        }
    });
    let tempIdUser = null;
    userMatch.forEach(element => {
        tempIdUser = element.id_user;
    });

    tempIdUser = tempIdUser.substr(0, 3);
    if (!req.header('x-auth-token')) {
        return res.status(400).send('Unauthorized')
    }

    try {
        if (tempIdUser == "CST") {
            let newIdPrefix = "CRT"
            let keyword = `%${newIdPrefix}%`
            let similarUID = await Cart.findAll(
                {
                    where: {
                        id_cart: {
                            [Op.like]: keyword
                        }
                    }
                }
            );
            let newIdCart = newIdPrefix + (similarUID.length + 1).toString().padStart(3, '0');
            const dataProduct = await Products.findAll({
                where: {
                    productName: {
                        [Op.like]: name
                    }
                }
            });
            let tempProductId = null;
            let tempPrice = null;
            dataProduct.forEach(element => {
                tempProductId = element.id_product;
                tempPrice = element.productPrice;
            });
            const newCart = await Cart.create({
                id_cart: newIdCart,
                id_user: userdata.id_user,
                id_product: tempProductId,
                productName: name,
                productPrice: tempPrice,
                quantity: quantity,
                created_at: new Date()
            });
            return res.status(201).send(newCart);
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }

});
module.exports = router;
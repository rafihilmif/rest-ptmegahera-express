const { response } = require("express");
const express = require("express");
const { Op, Sequelize } = require("sequelize");
const User = require("../models/Users");
const Cart = require("../models/Cart");
const Orders = require("../models/Orders");
const Shipping = require("../models/Shipping");
const Joi = require("joi");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_KEY = 'ptmegaheragunakarya';
const midtransClient = require("midtrans-client");

let coreClient = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: "SB-Mid-server-XxmjTZyiAUYtY8YrH2pH8FbJ",
    clientKey: "SB-Mid-client-F3IpcrwFPVfo0Wxp"
});
const checkShipping = async (courier) => {

    const categoryName = await Shipping.findOne(
        {
            where: {
                company_name: {
                    [Op.like]: courier
                }
            }
        }
    );
    if (!categoryName) {
        throw new Error("shipping not found!");
    }
};
//CHECKOUT ITEM FROM CART
router.post('/checkout', async function (req, res) {
    let { name, courier, address, zipcode, city, province, phone, note } = req.body;
    const schema = Joi.object({
        name: Joi.string().required(),
        courier: Joi.string().external(checkShipping).required(),
        address: Joi.string().required(),
        zipcode: Joi.string().required(),
        city: Joi.string().required(),
        province: Joi.string().required(),
        phone: Joi.number().required(),
        note: Joi.string().required()
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
            let newIdPrefix = "ORD"
            let keyword = `%${newIdPrefix}%`
            let similarUID = await Orders.findAll(
                {
                    where: {
                        id_order: {
                            [Op.like]: keyword
                        }
                    }
                }
            );
            let newIdOrder = newIdPrefix + (similarUID.length + 1).toString().padStart(3, '0');
            const dataCart = await Cart.findAll({
                where: {
                    id_user: {
                        [Op.like]: userdata.id_user
                    }
                }
            });
            let dataCost = await Cart.findAll(
                {
                    where: {
                        id_user: {
                            [Op.like]: userdata.id_user
                        }
                    },
                    attributes:
                        [
                            'id_cart',
                            'id_user',
                            'productName',
                            'productPrice',
                            'Quantity',
                            [Sequelize.literal('SUM(Quantity*productPrice)'), 'cost']
                        ]
                }
            );
            let fee = 0;
            const checkCourier = await Shipping.findAll({
                where: {
                    company_name: {
                        [Op.like]: courier
                    }
                }
            });
            checkCourier.forEach(element => {
                fee = element.dataValues.fee_shippings;
            });
            let subtotal = 0;
            dataCost.forEach(element => {
                subtotal = element.dataValues.cost;
            });
            subtotal = parseInt(subtotal) + parseInt(fee);
            const newOrder = await Orders.create({
                id_order: newIdOrder,
                id_user: userdata.id_user,
                name: name,
                courier: courier,
                deliverFee: fee,
                address: address,
                city: city,
                province: province,
                zipCode: zipcode,
                phone: phone,
                note: note,
                total: subtotal,
                status: "Waiting Confirmation"
            });
            const deleteDataCart = await Cart.destroy(
                {
                    where: {
                        id_user: {
                            [Op.like]: userdata.id_user
                        }
                    }
                }
            );
            return res.status(201).send({
                message: "Berhasil Checkout",
                newOrder
            });

        }
        else {
            return res.status(400).send("Bukan role customer, tidak dapat menggunakan fitur!");
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }
});
//CHARGE ITEM FROM CART
router.post('/charge', async function (req, res) {
    let { payment_type } = req.body;
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
            const dataOrder = await Orders.findAll({
                where: {
                    id_user: {
                        [Op.like]: userdata.id_user
                    },
                    status: {
                        [Op.like]: "Waiting Confirmation"
                    }
                }
            });
            let idOrder = null;
            let amount = null;
            dataOrder.forEach(element => {
                idOrder = element.id_order;
                amount = element.total;
            });
            if (dataOrder.length === 0) {
                return res.status(404).send("Data order salah!");
            }
            else {
                let parameter = {
                    "payment_type": "bank_transfer",
                    "transaction_details": {
                        "gross_amount": parseInt(amount),
                        "order_id": idOrder,
                    },
                    "bank_transfer": {
                        "bank": payment_type
                    }
                }
                coreClient.charge(parameter)
                    .then((chargeResponse) => {
                        res.json(chargeResponse);
                    })
                    .catch((err) => {
                        res.send(err.message);
                    });
            }
        }
        else {
            return res.status(400).send("Bukan role customer, tidak dapat menggunakan fitur!");
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }
});
//CHECK STATUS PAYMENT AND UPDATE ORDER
router.get('/payment/status', async function (req, res) {
    let { order_id } = req.query;
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
        if (tempIdUser == "STF") {
            const checkOrder = await Orders.findAll({
                where: {
                    id_order: {
                        [Op.like]: order_id
                    }
                }
            });
            if (checkOrder.length === 0) {
                return res.status(404).send("Data order tidak ditemukan");
            }
            else {
                coreClient.transaction.status(order_id)
                    .then((response) => {
                        res.json(response);
                        if (response.transaction_status == 'settlement') {
                            const updateOrder = Orders.update(
                                {
                                    status: "Paid"
                                }, {
                                where: {
                                    id_order: {
                                        [Op.like]: order_id
                                    }
                                }
                            });
                        }
                    }).catch((err) => {
                        res.send(err.message)
                    });
            }

        }
        else {
            return res.status(400).send("Bukan role staff, tidak dapat menggunakan fitur!");
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }
});
module.exports = router;
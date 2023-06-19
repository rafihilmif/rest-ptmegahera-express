const { response } = require("express");
const express = require("express");
const { Op, Sequelize } = require("sequelize");
const User = require("../models/Users");
const Cart = require("../models/Cart");
const Orders = require("../models/Orders");
const Joi = require("joi");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_KEY = 'ptmegaheragunakarya';
const midtransClient = require("midtrans-client");

let coreClient = new midtransClient.Snap({
    isProduction: false,
    serverKey: "SB-Mid-server-XxmjTZyiAUYtY8YrH2pH8FbJ",
    clientKey: "SB-Mid-client-F3IpcrwFPVfo0Wxp"
});

router.post('/checkout', async function (req, res) {
    let { name, courier, deliver_type, deliver_fee, address, zipcode, city, province, phone, note } = req.body;
    const schema = Joi.object({
        name: Joi.string().required(),
        courier: Joi.number().required(),
        deliver_type: Joi.string.required(),
        address: Joi.string().required(),
        zipcode: Joi.string().required(),
        city: Joi.string().required(),
        phone: Joi.string().required(),
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

            let subtotal = 0;
            dataCost.forEach(element => {
                subtotal = element.dataValues.cost;
            });
            subtotal = parseInt(subtotal) + parseInt(deliver_fee);
            const newOrder = await Orders.create({
                id_order: newIdOrder,
                id_user: userdata.id_user,
                name: name,
                courier: courier,
                deliverType: deliver_type,
                deliverFee: deliver_fee,
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
                    },
                    truncate: true
                }
            );
            return res.status(201).send({ subtotal });

        }
        else {
            return res.status(400).send("Bukan role customer, tidak dapat menggunakan fitur!");
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }
});
router.post('/payment', async function (req, res) {

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
    let tempEmailUser = null;
    let tempFirstName = null;
    let tempLastName = null;
    let tempTelephone = null;
    userMatch.forEach(element => {
        tempIdUser = element.id_user;
        tempEmailUser = element.email;
        tempFirstName = element.firstName;
        tempLastName = element.lastName;
        tempTelephone = element.phone;
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
                    }
                }
            });
            let idOrder = null;
            let amount = null;
            dataOrder.forEach(element => {
                idOrder = element.id_order;
                amount = element.total;
            });
            let parameter = {
                "transaction_details": {
                    "order_id": idOrder,
                    "gross_amount": amount
                },
                "enabled_payments": ["bca_va", "bni_va", "bri_va", "gopay", "shopeepay"],
                "calbacks": {

                },
                "customer_details": {
                    "first_name": tempFirstName,
                    "last_name": tempLastName,
                    "email": tempEmailUser,
                    "phone": tempTelephone
                }
            }
            coreClient.charge(parameter)
                .then((chargeResponse) => {
                    console.log('chargeResponse:', JSON.stringify(chargeResponse));
                })
                .catch((e) => {
                    console.log('Error occured:', e.message);
                });;

        }
        else {
            return res.status(400).send("Bukan role customer, tidak dapat menggunakan fitur!");
        }

    } catch (error) {

    }

});
module.exports = router;
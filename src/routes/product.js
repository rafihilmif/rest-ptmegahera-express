const { response } = require("express");
const express = require("express");
const { Op, Sequelize } = require("sequelize");
const User = require("../models/Users");
const Joi = require("joi");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const JWT_KEY = 'ptmegaheragunakarya';

router.post('/add/product', async function (req, res) {
    let { email, password, firstName, lastName, birthdate, address, city, province, phone } = req.body;
        const schema = Joi.object({
        email: Joi.string().external(checkEmail).email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(),
        password: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        birthdate: Joi.date().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        province: Joi.string().required(),
        phone: Joi.string().required()
        });
        try {
             await schema.validateAsync(req.body)
        }     catch (error) {
             return res.status(400).send(error.toString())
        }
        let newIdPrefix = "CST"
            let keyword = `%${newIdPrefix}%`
            let similarUID = await User.findAll(
                {
                    where: {
                        id_user: {
                            [Op.like]: keyword
                        }
                    }
                }
            );
    let newIdCustomer = newIdPrefix + (similarUID.length + 1).toString().padStart(3, '0');
    const passwordHash = bcrypt.hashSync(password, 10);
    const newCustomer = await User.create({
                id_user: newIdCustomer,
                email: email,
                password: passwordHash,
                firstName: firstName,
                lastName: lastName,
                birthdate: birthdate,
                address: address,
                city: city,
                province: province,
                phone: phone,
                status: 1
    });
    return res.status(201).send({
                "message": "berhasil register",
    });
});
module.exports = router;
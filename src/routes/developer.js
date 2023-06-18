const { response } = require("express");
const express = require("express");
const { Op, Sequelize } = require("sequelize");
const Developer = require("../models/Developer");
const path = require('path');
const Joi = require("joi");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_KEY = 'ptmegaheragunakarya';

const checkEmail = async (email) => {

    const userEmail = await Developer.findOne(
        {
            where: {
                email: {
                    [Op.like]: email
                }
            }
        }
    );
    if (userEmail) {
        throw new Error("email is not unique")
    }
};
const checkUsername = async (username) => {

    const userEmail = await Developer.findOne(
        {
            where: {
                username: {
                    [Op.like]: username
                }
            }
        }
    );
    if (userEmail) {
        throw new Error("username is not unique")
    }
};

router.post('/register/account/developer', async function (req, res) {
    let { email, username, password, balance } = req.body;
    const schema = Joi.object({
        email: Joi.string().external(checkEmail).email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(),
        username: Joi.string().external(checkUsername).required(),
        password: Joi.string().required()
    });
    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(400).send(error.toString())
    }
    let newIdPrefix = "DEV"
    let keyword = `%${newIdPrefix}%`
    let similarUID = await Developer.findAll(
        {
            where: {
                id_developer: {
                    [Op.like]: keyword
                }
            }
        }
    );
    let newIdCustomer = newIdPrefix + (similarUID.length + 1).toString().padStart(3, '0');
    if (email.indexOf('@ptmegahera.com') > -1) {
        return res.status(400).send({
            "message": "gagal registrasi",
        });
    }
    else {
        const passwordHash = bcrypt.hashSync(password, 10);
        const newDeveloper = await Developer.create({
            id_user: newIdCustomer,
            email: email,
            username: username,
            password: passwordHash,
            balance: 10000
        });
        return res.status(201).send({
            "message": "berhasil register",
        });

    }
});
router.get('/register/account/developer', async function (req, res) {

});
module.exports = router;
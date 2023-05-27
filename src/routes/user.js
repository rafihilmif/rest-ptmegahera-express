const { response } = require("express");
const express = require("express");
const { Op, Sequelize } = require("sequelize");
const User = require("../models/Users");

const Joi = require("joi");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const JWT_KEY = 'ptmegaheragunakarya';

const checkEmail = async (email) => {

    const userEmail = await User.findOne(
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
//REGISTER CUSTOMER
router.post('/add/account/customer', async function (req, res) {
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
    } catch (error) {
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
//LOGIN
router.get('/login', async function (req, res) {
    let { email, password } = req.body;
    const existUser = await User.findAll({
        where: {
            email: email
        }
    });
    if (existUser.length > 0) {
        const passwordUser = await User.findAll({
            where: {
                email: email
            }
        });
        let tempPassword = null;
        passwordUser.forEach(element => {
            tempPassword = element.password;
        });
        let passwordHash = tempPassword;
        if (bcrypt.compareSync(password, passwordHash)) {
            const tempDataUser = await User.findOne({
                where: {
                    email: email
                }
            });
            let token = jwt.sign({
                id_user: tempDataUser.id_user,
                email: email,
                firstName: tempDataUser.firstName,
                lastName: tempDataUser.lastName,
                birthdate: tempDataUser.birthdate,
                address: tempDataUser.address,
                city: tempDataUser.city,
                province: tempDataUser.province,
                phone: tempDataUser.phone
            }, JWT_KEY, { expiresIn: '1800s' });
            return res.status(200).send({
                'message': 'Successfully logged in ' + email,
                token: token
            });
        }
        else {
            return res.status(400).send({
                "message": "Password salah, login gagal",
            });
        }
    }
    else {
        return res.status(404).send({
            "message": "Data tidak valid, login gagal",
        });
    }
});
//REGISTER STAFF
router.post('/add/account/staff', async function (req, res) {

    let { email, username, password, firstName, lastName, birthdate, address, city, province, phone } = req.body;

    let token = req.header('x-auth-token');
    let userdata = jwt.verify(token, JWT_KEY);

    if (!req.header('x-auth-token')) {
        return res.status(400).send('Unauthorized')
    }
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
    } catch (error) {
        return res.status(400).send(error.toString())
    }
    try {
        if (userdata.id_user == "ADMIN") {
            let newIdPrefix = "STF"
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
            let newIdStaff = newIdPrefix + (similarUID.length + 1).toString().padStart(3, '0');
            const passwordHash = bcrypt.hashSync(password, 10);
            const newStaff = await User.create({
                id_user: newIdStaff,
                email: email,
                username: username,
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
                newStaff
            });
        }
        else {
            return res.status(400).send({
                message: 'Bukan role Admin, tidak dapat menggunakan fitur'
            });
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }

});
router.put('/update/account/:username', async function (req, res) {

    let { username } = req.params;
    let { password, firstName, lastName, birthdate, address, city, province, phone } = req.body;

    let token = req.header('x-auth-token');
    let userdata = jwt.verify(token, JWT_KEY);

    if (!req.header('x-auth-token')) {
        return res.status(400).send('Unauthorized')
    }
    const schema = Joi.object({
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
    } catch (error) {
        return res.status(400).send(error.toString())
    }

    try {
        if (userdata.id_user == "ADMIN") {
            const matchData = await User.findAll({
                where: {
                    username: {
                        [Op.like]: username
                    }
                }
            });
            console.log(matchData);
            if (matchData.length === 0) {
                return res.status(404).send({
                    "message": "data tidak ditemukan!"
                });
            }
            else {
                const passwordHash = bcrypt.hashSync(password, 10);
                const newDataAccount = await User.update(
                    {
                        password: passwordHash,
                        firstName: firstName,
                        lastName: lastName,
                        birthdate: birthdate,
                        address: address,
                        city: city,
                        province: province,
                        phone: phone
                    }, {
                    where: {
                        username: {
                            [Op.like]: username
                        }
                    }
                });
                return res.status(201).send({
                    "message": "biodata dengan username " + username + " berhasil diubah",
                    "firstname": firstName,
                    "lastname": lastName,
                    "birthdate": birthdate,
                    "address": address,
                    "city": city,
                    "province": province,
                    "phone": phone
                });
            }
        }
        else {
            return res.status(400).send({
                message: 'Bukan role Admin, tidak dapat menggunakan fitur'
            });
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }

});
router.get('/account/:username', async function (req, res) {
    let { username } = req.params;

    let token = req.header('x-auth-token');
    let userdata = jwt.verify(token, JWT_KEY);

    if (!req.header('x-auth-token')) {
        return res.status(400).send('Unauthorized')
    }
    try {
        if (userdata.id_user == "ADMIN") {

            const dataUser = await User.findAll(
                {
                    where: {
                        username: {
                            [Op.like]: username
                        }
                    },
                    attributes: {
                        exclude: ['password', 'status']
                    }
                }
            );
            if (dataUser.length === 0) {
                return res.status(404).send({
                    message: 'User tidak ditemukan'
                });
            }
            else {
                return res.status(200).send({
                    dataUser
                });
            }
        } else {
            return res.status(400).send({
                message: 'Bukan role Admin, tidak dapat menggunakan fitur'
            });
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }
});

router.get('/account', async function (req, res) {
    let token = req.header('x-auth-token');
    let userdata = jwt.verify(token, JWT_KEY);

    if (!req.header('x-auth-token')) {
        return res.status(400).send('Unauthorized')
    }
    try {
        if (userdata.id_user == "ADMIN") {

            const dataUser = await User.findAll(
                {
                    attributes: {
                        exclude: ['password', 'status']
                    }
                }
            );
            if (dataUser.length === 0) {
                return res.status(404).send({
                    message: 'User tidak ditemukan'
                });
            }
            else {
                return res.status(200).send({
                    dataUser
                });
            }
        } else {
            return res.status(400).send({
                message: 'Bukan role Admin, tidak dapat menggunakan fitur'
            });
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }
});
router.delete('/delete/account/:username', async function (req, res) {
    let { username } = req.params;
    let token = req.header('x-auth-token');
    let userdata = jwt.verify(token, JWT_KEY);

    if (!req.header('x-auth-token')) {
        return res.status(400).send('Unauthorized')
    }
    try {
        if (userdata.id_user == "ADMIN") {
            const deleteAccount = await User.destroy({
                where: {
                    username: {
                        [Op.like]: username
                    }
                }
            });
            return res.status(400).send({
                message: "data dengan username " + username + " berhasil dihapus!"
            });
        } else {
            return res.status(400).send({
                message: 'Bukan role Admin, tidak dapat menggunakan fitur'
            });
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }
});
module.exports = router;
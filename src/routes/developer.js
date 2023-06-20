const { response } = require("express");
const express = require("express");
const { Op, Sequelize } = require("sequelize");
const Developer = require("../models/Developer");
const Products = require("../models/Products");
const Suppliers = require("../models/Suppliers");
const Category = require("../models/Category");
const path = require('path');
const Joi = require("joi");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_KEY = 'ptmegaheragunakarya';
const bcrypt = require('bcrypt');

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
//REGISTER DEVELOPER ACCOUNT
router.post('/register/account/developer', async function (req, res) {
    let { email, username, password} = req.body;
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
    let newIdDev = newIdPrefix + (similarUID.length + 1).toString().padStart(3, '0');
    if (email.indexOf('@ptmegahera.com') > -1) {
        return res.status(400).send({
            "message": "gagal registrasi",
        });
    }
    else {
        const passwordHash = bcrypt.hashSync(password, 10);
        const newDeveloper = await Developer.create({
            id_developer: newIdDev,
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
//LOGIN DEVELOPER ACCOUNT
router.get('/developer/login', async function (req, res) {
    let { email, password } = req.body;
    const existDev = await Developer.findAll({
        where: {
            email: email
        }
    });
    if (existDev.length > 0) {
        const passwordDev = await Developer.findAll({
            where: {
                email: email
            }
        });
        let tempPassDev = null;
        passwordDev.forEach(element => {
            tempPassDev = element.password;
        });
        let passwordHash = tempPassDev;
        if (bcrypt.compareSync(password, passwordHash)) {
            const tempDataDev = await Developer.findOne({
                where: {
                    email: email
                }
            });
            let token = jwt.sign({
                id_developer: tempDataDev.id_developer,
                email: email,
                username: tempDataDev.username,
                balance: tempDataDev.balance
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
//GET PRODUCT BY NAME, MIN PRICE BETWEEN MAX PRICE WITH CHARGE
router.get('/developer/product', async function (req, res) {
    let { name, minPrice, maxPrice } = req.query;
    let token = req.header('x-auth-token');
    let userdata = jwt.verify(token, JWT_KEY);
    const devMatch = await Developer.findAll({
        where: {
            id_developer: {
                [Op.like]: userdata.id_developer
            }
        }
    });
    let tempIdDev = null;
    let balanceOld = 0;
    devMatch.forEach(element => {
        tempIdDev = element.id_developer;
        balanceOld = element.balance;
    });

    tempIdDev = tempIdDev.substr(0, 3);
    console.log(tempIdDev);
    if (!req.header('x-auth-token')) {
        return res.status(400).send('Unauthorized')
    }
    try {
        if (tempIdDev == "DEV") {
            const productData = await Products.findAll({});
            if (parseInt(balanceOld) < 500) {
                return res.status(404).send('Balance tidak mencukupi, silahkan top-up!');
            }
            else {
                if (productData.length === 0) {
                    let balanceNew = parseInt(balanceOld) - 500;
                    const updateBalance = await Developer.update({
                        balance: balanceNew
                    }, {
                        where: {
                            id_developer: {
                                [Op.like]: userdata.id_developer
                            }
                        }
                    }
                    );
                    return res.status(404).send('Product tidak ditemukan');
                }
                else {
                    if (name == null && minPrice == null && maxPrice == null) {
                        const productData = await Products.findAll({});
                        let balanceNew = parseInt(balanceOld) - 500;
                        const updateBalance = await Developer.update({
                            balance: balanceNew
                        }, {
                            where: {
                                id_developer: {
                                    [Op.like]: userdata.id_developer
                                }
                            }
                        }
                        );
                        return res.status(200).send(productData);
                    }
                    else if (name == null) {
                        const productByPrice = await Products.findAll({
                            where: {
                                productPrice: {
                                    [Op.gte]: minPrice,
                                    [Op.lte]: maxPrice
                                }
                            }
                        });
                        let balanceNew = parseInt(balanceOld) - 500;
                        const updateBalance = await Developer.update({
                            balance: balanceNew
                        }, {
                            where: {
                                id_developer: {
                                    [Op.like]: userdata.id_developer
                                }
                            }
                        }
                        );
                        return res.status(200).send(productByPrice);
                    }
                    else if (minPrice == null || maxPrice == null) {
                        const productByName = await Products.findAll({
                            where: {
                                productName: {
                                    [Op.like]: name ? '%' + name + '%' : '%%'
                                }
                            }
                        });
                        let balanceNew = parseInt(balanceOld) - 500;
                        const updateBalance = await Developer.update({
                            balance: balanceNew
                        }, {
                            where: {
                                id_developer: {
                                    [Op.like]: userdata.id_developer
                                }
                            }
                        }
                        );
                        return res.status(200).send(productByName);
                    }
                    else if (minPrice != null && maxPrice != null) {

                        const productByNamePrice = await Products.findAll({
                            where: {
                                productName: {
                                    [Op.like]: name ? '%' + name + '%' : '%%'
                                },
                                productPrice: {
                                    [Op.between]: [minPrice, maxPrice]
                                }
                            }
                        });
                        let balanceNew = parseInt(balanceOld) - 500;
                        const updateBalance = await Developer.update({
                            balance: balanceNew
                        }, {
                            where: {
                                id_developer: {
                                    [Op.like]: userdata.id_developer
                                }
                            }
                        }
                        );
                        return res.status(200).send(productByNamePrice);
                    }
                }
            }
        }
        else {
            return res.status(400).send('Bukan role Developer, tidak dapat menggunakan fitur');
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }
});
//GET SUPPLIER BY NAME WITH CHARGE
router.get('/developer/supplier', async function (req, res) {
    let { name } = req.query

    let token = req.header('x-auth-token');
    let userdata = jwt.verify(token, JWT_KEY);

    if (!req.header('x-auth-token')) {
        return res.status(400).send('Unauthorized')
    }
    const devMatch = await Developer.findAll({
        where: {
            id_developer: {
                [Op.like]: userdata.id_developer
            }
        }
    });
    let tempIdDev = null;
    let balanceOld = 0;
    devMatch.forEach(element => {
        tempIdDev = element.id_developer;
        balanceOld = element.balance;
    });

    tempIdDev = tempIdDev.substr(0, 3);
    if (!req.header('x-auth-token')) {
        return res.status(400).send('Unauthorized')
    }
    try {
        if (tempIdDev == "DEV") {
            if (parseInt(balanceOld) < 500) {
                return res.status(404).send('Balance tidak mencukupi, silahkan top-up!');
            }
            else {
                const dataSupplier = await Suppliers.findAll({});
                if (dataSupplier.length === 0) {
                    let balanceNew = parseInt(balanceOld) - 500;
                    const updateBalance = await Developer.update({
                        balance: balanceNew
                    }, {
                        where: {
                            id_developer: {
                                [Op.like]: userdata.id_developer
                            }
                        }
                    }
                    );
                    return res.status(404).send("Data Supllier tidak ditemukan!");
                }
                else {
                    if (name == null) {
                        let balanceNew = parseInt(balanceOld) - 500;
                        const updateBalance = await Developer.update({
                            balance: balanceNew
                        }, {
                            where: {
                                id_developer: {
                                    [Op.like]: userdata.id_developer
                                }
                            }
                        }
                        );
                        return res.status(200).send(dataSupplier);
                    }
                    else {
                        const dataSupplierName = await Suppliers.findAll({
                            where: {
                                companyName: {
                                    [Op.like]: name ? '%' + name + '%' : '%%'
                                }
                            }
                        });
                        let balanceNew = parseInt(balanceOld) - 500;
                        const updateBalance = await Developer.update({
                            balance: balanceNew
                        }, {
                            where: {
                                id_developer: {
                                    [Op.like]: userdata.id_developer
                                }
                            }
                        }
                        );
                        return res.status(200).send(dataSupplierName);
                    }
                }
            }
        } else {
            return res.status(400).send({
                message: 'Bukan role Developer, tidak dapat menggunakan fitur'
            });
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }
});
//GET CATEGORY BY NAME WITH CHARGE
router.get('/developer/category', async function (req, res) {
    let { name } = req.query

    let token = req.header('x-auth-token');
    let userdata = jwt.verify(token, JWT_KEY);

    if (!req.header('x-auth-token')) {
        return res.status(400).send('Unauthorized')
    }
    const devMatch = await Developer.findAll({
        where: {
            id_developer: {
                [Op.like]: userdata.id_developer
            }
        }
    });
    let tempIdDev = null;
    let balanceOld = 0;
    devMatch.forEach(element => {
        tempIdDev = element.id_developer;
        balanceOld = element.balance;
    });

    tempIdDev = tempIdDev.substr(0, 3);
    if (!req.header('x-auth-token')) {
        return res.status(400).send('Unauthorized')
    }
    try {
        if (tempIdDev == "DEV") {
            if (parseInt(balanceOld) < 500) {
                return res.status(404).send('Balance tidak mencukupi, silahkan top-up!');
            }
            else {
                const dataCategory = await Category.findAll();
                if (dataCategory.length === 0) {
                    return res.status(404).send("Data Category tidak ditemukan!");
                }
                else {
                    if (name == null) {
                        let balanceNew = parseInt(balanceOld) - 500;
                        const updateBalance = await Developer.update({
                            balance: balanceNew
                        }, {
                            where: {
                                id_developer: {
                                    [Op.like]: userdata.id_developer
                                }
                            }
                        }
                        );
                        return res.status(200).send(dataCategory);
                    }
                    else {
                        const dataCategoryByName = await Category.findAll({
                            where: {
                                categoryName: {
                                    [Op.like]: name ? '%' + name + '%' : '%%'
                                }
                            }
                        });
                        let balanceNew = parseInt(balanceOld) - 500;
                        const updateBalance = await Developer.update({
                            balance: balanceNew
                        }, {
                            where: {
                                id_developer: {
                                    [Op.like]: userdata.id_developer
                                }
                            }
                        }
                        );
                        return res.status(200).send(dataCategoryByName);
                    }
                }
            }
        } else {
            return res.status(400).send({
                message: 'Bukan role Developer, tidak dapat menggunakan fitur'
            });
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }
});
//TOP UP BALANCE BY DEVELOPER LOGIN
router.post('/developer/topup', async function (req, res) {
    let { balanceNew } = req.body;

    let token = req.header('x-auth-token');
    let userdata = jwt.verify(token, JWT_KEY);

    if (!req.header('x-auth-token')) {
        return res.status(400).send('Unauthorized')
    }
    const devMatch = await Developer.findAll({
        where: {
            id_developer: {
                [Op.like]: userdata.id_developer
            }
        }
    });
    let tempIdDev = null;
    let balanceOld = 0;
    devMatch.forEach(element => {
        tempIdDev = element.id_developer;
        balanceOld = element.balance;
    });

    tempIdDev = tempIdDev.substr(0, 3);
    if (!req.header('x-auth-token')) {
        return res.status(400).send('Unauthorized')
    }
    try {
        if (tempIdDev == "DEV") {
            let tempBalanceNew = parseInt(balanceOld) + parseInt(balanceNew);
            const updateBalance = await Developer.update({
                balance: tempBalanceNew
            }, {
                where: {
                    id_developer: {
                        [Op.like]: userdata.id_developer
                    }
                }
            }
            );
            return res.status(200).send('BERHASIL TOP UP ' + balanceNew);
        }
        else {
            return res.status(400).send({
                message: 'Bukan role Developer, tidak dapat menggunakan fitur'
            });
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }
});
module.exports = router;
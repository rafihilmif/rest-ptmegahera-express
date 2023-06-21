const { response } = require("express");
const express = require("express");
const { Op, Sequelize } = require("sequelize");
const User = require("../models/Users");
const Category = require("../models/Category");
const Joi = require("joi");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_KEY = 'ptmegaheragunakarya';

const checkCategoryAvailable = async (name) => {

    const categoryName = await Category.findOne(
        {
            where: {
                categoryName: {
                    [Op.like]: name
                }
            }
        }
    );
    if (categoryName) {
        throw new Error("category can't be duplicate")
    }
};
//ADD CATEGORY WITH ROLE STAFF
router.post('/add/category', async function (req, res) {
    let { name, description } = req.body;
    const schema = Joi.object({
        name: Joi.string().external(checkCategoryAvailable).required(),
        description: Joi.string().required()
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
        if (tempIdUser == "STF") {
            let newIdPrefix = "CAT"
            let keyword = `%${newIdPrefix}%`
            let similarUID = await Category.findAll(
                {
                    where: {
                        id_category: {
                            [Op.like]: keyword
                        }
                    }
                }
            );
            let newIdCategory = newIdPrefix + (similarUID.length + 1).toString().padStart(3, '0');

            const newCategory = await Category.create({
                id_category: newIdCategory,
                categoryName: name,
                categoryDesc: description,
                status: 1
            });
            return res.status(201).send({
                "message": "category berhasil ditambahkan",
            });
        }
        else {
            return res.status(400).send({
                message: 'Bukan role Staff, tidak dapat menggunakan fitur'
            });
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }
});
//GET CATEGORY ALL AND BY NAME
router.get('/category', async function (req, res) {
    let { name } = req.query;
    let token = req.header('x-auth-token');
    let userdata = jwt.verify(token, JWT_KEY);

    if (!req.header('x-auth-token')) {
        return res.status(400).send('Unauthorized')
    }
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

    try {
        if (tempIdUser == "STF") {
            const dataCategory = await Category.findAll();
            if (dataCategory.length === 0) {
                return res.status(404).send("Data Category tidak ditemukan!");
            }
            else {
                if (name == null) {
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
                    return res.status(200).send(dataCategoryByName);
                }
            }
        }
        else {
            return res.status(400).send('Bukan role Staff, tidak dapat menggunakan fitur');
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }
});
//UPDATE CATEGORY BY NAME
router.put('/update/category', async function (req, res) {
    let { new_name, description } = req.body;
    let { name } = req.query;
    const schema = Joi.object({
        new_name: Joi.string().external(checkCategoryAvailable).required(),
        description: Joi.string().required()
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
        if (tempIdUser == "STF") {
            const dataCategory = await Category.findAll({
                where: {
                    categoryName: {
                        [Op.like]: name
                    }
                }
            });

            if (dataCategory.length === 0) {
                return res.status(404).send("data category tidak ditemukan!");
            }
            else {
                const updateCategory = await Category.update({
                    categoryName: new_name,
                    categoryDesc: description
                }, {
                    where: {
                        categoryName: {
                            [Op.like]: name
                        }
                    }
                });
                return res.status(200).send({
                    "message": "data category dengan old name " + name + " berhasil diubah",
                    "category new name": new_name,
                    "category description": description
                });
            }
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }
});
//DELETE CATEGORY BY NAME
router.delete('/delete/category', async function (req, res) {
    let { name } = req.query;

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
            const dataCategory = await Category.findAll({
                where: {
                    categoryName: {
                        [Op.like]: name
                    }
                }
            });
            if (dataCategory.length === 0) {
                return res.status(404).send({
                    message: "data dengan nama " + name + " tidak ditemukan!"
                });
            } else {
                const deleteCategory = await Category.destroy({
                    where: {
                        categorName: {
                            [Op.like]: name
                        }
                    }
                });
                return res.status(200).send({
                    message: "Data category " + name + " berhasil dihapus!"
                });
            }

        } else {
            return res.status(400).send({
                message: 'Bukan role Staff, tidak dapat menggunakan fitur'
            });
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }
});
module.exports = router;
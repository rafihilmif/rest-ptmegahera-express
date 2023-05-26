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
//ADD CATEGORY
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
module.exports = router;
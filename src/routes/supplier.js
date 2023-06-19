const { response } = require("express");
const express = require("express");
const { Op, Sequelize } = require("sequelize");
const User = require("../models/Users");
const Suppliers = require("../models/Suppliers");

const multer = require('multer');
const path = require('path');
const Joi = require("joi");
const router = express.Router();
const fs = require('fs');
const jwt = require("jsonwebtoken");
const JWT_KEY = 'ptmegaheragunakarya';

const checkSupplier = async (name) => {

    const supplierName = await Suppliers.findOne(
        {
            where: {
                companyName: {
                    [Op.like]: name
                }
            }
        }
    );
    if (supplierName) {
        throw new Error("supplier can't be duplicate")
    }
};
//UPLOAD FILE IMAGE
const storage = multer.diskStorage({
    destination: function name(req, file, cb) {
        cb(null, './assets/image/logo');
    },
    filename: function name(req, file, cb) {
        cb(null, `${Date.now()}.jpg`);
    }
});
const upload = multer({ storage: storage });
//ADD SUPPLIER WITH ROLE STAFF
router.post('/add/supplier', upload.single('logo'), async function (req, res) {
    let { name } = req.body;
    let { logo } = req.file;

    const filePath = req.file.filename;
    const schema = Joi.object({
        name: Joi.string().external(checkSupplier).required(),
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
            let newIdPrefix = "SUP"
            let keyword = `%${newIdPrefix}%`
            let similarUID = await Suppliers.findAll(
                {
                    where: {
                        id_supplier: {
                            [Op.like]: keyword
                        }
                    }
                }
            );
            let newIdSupplier = newIdPrefix + (similarUID.length + 1).toString().padStart(3, '0');
            if (!req.file) {
                return res.status(400).send({
                    "message": "Tidak ada file yang diupload, harap upload file logo!",
                });
            } else {
                const newSupplier = await Suppliers.create({
                    id_supplier: newIdSupplier,
                    companyName: name,
                    companyLogo: filePath,
                    status: 1
                });
                return res.status(201).send({
                    "message": "Data supplier berhasil ditambahkan",
                });
            }

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
//GET ALL DATA SUPLLIER AND BY NAME
router.get('/supplier', async function (req, res) {
    let { name } = req.query

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
            const dataSupplier = await Suppliers.findAll({});
            if (dataSupplier.length === 0) {
                return res.status(404).send("Data Supllier tidak ditemukan!");
            }
            else {
                if (name == null) {
                    return res.status(200).send(dataSupplier);
                }
                else {
                    const dataSupllierName = await Suppliers.findAll({
                        where: {
                            companyName: {
                                [Op.like]: name ? '%' + name + '%' : '%%'
                            }
                        }
                    });
                    return res.status(200).send(dataSupllierName);
                }
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
//UPDATE SUPPLIER BY NAME
router.put('/update/supplier/:name', upload.single('logo'), async function (req, res) {
    let { name } = req.params;
    let { newName } = req.body;
    let { logo } = req.file;

    const filePath = req.file.filename;
    const schema = Joi.object({
        newName: Joi.string().external(checkSupplier).required(),
        logo: Joi.any()
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
    let fileNameLogo = null;
    const supplierNameFile = await Suppliers.findAll({
        where: {
            companyName: {
                [Op.like]: name
            }
        }
    });
    supplierNameFile.forEach(element => {
        fileNameLogo = element.companyLogo;
    });
    try {
        if (tempIdUser == "STF") {
            const dataSupplier = await Suppliers.findAll({
                where: {
                    companyName: {
                        [Op.like]: name
                    }
                }
            });
            if (dataSupplier.length === 0) {
                return res.status(404).send({
                    "message": "Data supplier tidak ditemukan!",
                });
            }
            else {
                if (!req.file) {
                    return res.status(400).send({
                        "message": "Tidak ada file yang diupload, harap upload file logo!",
                    });
                } else {
                    const newDataSupplier = await Suppliers.update({
                        companyName: newName,
                        companyLogo: filePath,
                        status: 1,

                    },
                        {
                            where: {
                                companyName: {
                                    [Op.like]: name
                                }
                            }
                        }
                    );
                    fs.unlinkSync(`./assets/image/logo/${fileNameLogo}`);
                    return res.status(201).send({
                        "message": "Data supplier berhasil diupdate",
                    });
                }
            }
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
//DELETE SUPPLIER BY NAME
router.delete('/delete/supplier/:name', async function (req, res) {
    let { name } = req.params;
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
    let fileNameLogo = null;
    const supplierNameFile = await Suppliers.findAll({
        where: {
            companyName: {
                [Op.like]: name
            }
        }
    });
    supplierNameFile.forEach(element => {
        fileNameLogo = element.companyLogo;
    });
    try {
        if (tempIdUser == "STF") {
            const dataSupplier = await Suppliers.findAll({
                where: {
                    companyName: {
                        [Op.like]: name
                    }
                }
            });
            if (dataSupplier.length === 0) {
                return res.status(404).send({
                    "message": "Supplier tidak ditemukan!",
                });
            } else {
                const deleteSupplier = await Suppliers.destroy({
                    where: {
                        companyName: {
                            [Op.like]: name
                        }
                    }
                });
                fs.unlinkSync(`./assets/image/logo/${fileNameLogo}`);
                return res.status(200).send({
                    message: "Data supplier " + name + " berhasil dihapus!"
                });
            }
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
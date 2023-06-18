const { response } = require("express");
const express = require("express");
const { Op, Sequelize } = require("sequelize");
const User = require("../models/Users");
const Products = require("../models/Products");
const Category = require("../models/Category");
const Suppliers = require("../models/Suppliers");

const multer = require('multer');
const path = require('path');
const Joi = require("joi");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


const JWT_KEY = 'ptmegaheragunakarya';

const checkProductName = async (name) => {

    const productName = await Products.findOne(
        {
            where: {
                productName: {
                    [Op.like]: name
                }
            }
        }
    );
    if (productName) {
        throw new Error("product can't be duplicate!")
    }
};
const checkCategory = async (category) => {

    const categoryName = await Category.findOne(
        {
            where: {
                categoryName: {
                    [Op.like]: category
                }
            }
        }
    );
    if (!categoryName) {
        throw new Error("category not found!");
    }
};
const checkSupplier = async (brand) => {

    const companyName = await Suppliers.findOne(
        {
            where: {
                companyName: {
                    [Op.like]: brand
                }
            }
        }
    );
    if (!companyName) {
        throw new Error("brand not found!");
    }
};
const storage = multer.diskStorage({
    destination: function name(req, file, cb) {
        cb(null, './assets/image/product');
    },
    fileFilter: function name(req, file, cb) {
        if (file.mimetype == "image/png"
            || file.mimetype == "image/jpg"
            || file.mimetype == "image/jpeg"
            || file.mimetype == "image/gif") {
            cb(null, true);
        } else {
            cb(null, false);
            cb(new Error('Only .png, .gif, .jpg and .jpeg format allowed!'));
        }
    },
    filename: function name(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, fileName);
        req.on('aborted', () => {
            const fullFilePath = path.join('assets', 'image', 'product', fileName);
            file.stream.on('end', () => {
                fs.unlink(fullFilePath, (err) => {
                    console.log(fullFilePath);
                    if (err) {
                        throw err;
                    }
                });
            });
            file.stream.emit('end');
        })
    }

});
const upload = multer({ storage: storage });
//ADD PRODUCT WTIH ROLE STAFF
router.post('/add/product', upload.single('picture'), async function (req, res) {
    let { name, description, price, quantity, brand, category } = req.body;
    let { picture } = req.file;

    const filePath = `${req.protocol}://${req.get('host')}/image/product/${req.file.filename}`;
    const schema = Joi.object({
        name: Joi.string().external(checkProductName).required(),
        category: Joi.string().external(checkCategory).required(),
        brand: Joi.string().external(checkSupplier).required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().required()
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
            let newIdPrefix = "PRD"
            let keyword = `%${newIdPrefix}%`
            let similarUID = await Products.findAll(
                {
                    where: {
                        id_product: {
                            [Op.like]: keyword
                        }
                    }
                }
            );
            let newIdProduct = newIdPrefix + (similarUID.length + 1).toString().padStart(3, '0');

            let newIdPrefixSKU = "SKN"
            let keywordSKU = `%${newIdPrefix}%`
            let similarUIDSKU = await Products.findAll(
                {
                    where: {
                        sku: {
                            [Op.like]: keyword
                        }
                    }
                }
            );
            let newIdSKU = newIdPrefixSKU + (similarUIDSKU.length + 1).toString().padStart(3, '0');

            const dataBrand = await Suppliers.findAll({
                where: {
                    companyName: {
                        [Op.like]: brand
                    }
                }
            });
            let tempIdBrand = null;
            let tempNameBrand = null;
            dataBrand.forEach(element => {
                tempIdBrand = element.id_supplier;
                tempNameBrand = element.companyName;
            });
            tempNameBrand = tempNameBrand.substr(0, 3).toUpperCase();
            const dataCategory = await Category.findAll({
                where: {
                    categoryName: {
                        [Op.like]: category
                    }
                }
            });
            let tempIdCategory = null;
            let tempNameCategory = null;
            dataCategory.forEach(element => {
                tempIdCategory = element.id_category;
                tempNameCategory = element.categoryName;
            });
            tempNameCategory = tempNameCategory.substr(0, 4).toUpperCase();
            const newProduct = await Products.create({
                id_product: newIdProduct,
                id_supplier: tempIdBrand,
                id_category: tempIdCategory,
                sku: tempNameBrand + tempNameCategory + newIdSKU,
                productName: name,
                productDesc: description,
                productPrice: price,
                productQuantity: quantity,
                productPicture: req.file.filename,
                status: 1
            });
            return res.status(201).send({
                message: "Berhasil menambahkan produk dengan nama" + name,
                "id_product": newIdProduct,
                "id_supplier": tempIdBrand,
                "id_category": tempIdCategory,
                "SKU": tempNameBrand + tempNameCategory + newIdSKU,
                "name": name,
                "description": description,
                "price": price,
                "qty": quantity,
                "url-image-path": filePath
            });
        }
        else {
            return res.status(400).send('Bukan role Staff, tidak dapat menggunakan fitur');
        }
    } catch (error) {
        return res.status(400).send('Invalid JWT Key');
    }

});
router.get('/product', async function (req, res) {
    let { name, minPrice, maxPrice } = req.query;
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
            const productData = await Products.findAll({});
            if (productData.length === 0) {
                return res.status(404).send('Product tidak ditemukan');
            }
            else {
                if (name == '' && minPrice == '' && maxPrice == '') {
                    return res.status(200).send(productData);
                }
                else if (minPrice == '' || maxPrice == '') {
                    const productByName = await Products.findAll({
                        where: {
                            productName: {
                                [Op.like]: name ? '%' + name + '%' : '%%'
                            }
                        }
                    });
                }
                else {
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
module.exports = router;
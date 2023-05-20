const express = require("express");

const User = require("./models/User");
const Products = require("./models/Products");
const Category = require("./models/Category");
const Suppliers = require("./models/Suppliers");
const Order = require("./models/Order");
const OrderDetails = require("./models/OrderDetails");
const History = require("./models/History");
const Payment = require("./models/Payment");
const Shipping = require("./models/Shipping");

const app = express();

app.set("port", 3000);
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.listen(app.get("port"), () => {
    console.log(`Server started at http://localhost:${app.get("port")}`);
});
module.exports = app;
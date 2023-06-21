const express = require("express");

const user = require("./routes/user");
const category = require("./routes/category");
const supplier = require("./routes/supplier");
const product = require("./routes/product");
const cart = require("./routes/cart");
const checkout = require("./routes/checkout");
const developer = require("./routes/developer");

const Users = require("./models/Users");
const Products = require("./models/Products");
const Category = require("./models/Category");
const Suppliers = require("./models/Suppliers");
const Cart = require("./models/Cart");
const Orders = require("./models/Orders");
const Developer = require("./models/Developer");
const Shipping = require("./models/Shipping");

const app = express();

app.set("port", 3000);
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api", user);
app.use("/api", category);
app.use("/api", supplier);
app.use("/api", product);
app.use("/api", cart);
app.use("/api", checkout);
app.use("/api", developer);

app.listen(app.get("port"), () => {
    console.log(`Server started at http://localhost:${app.get("port")}`);
});
module.exports = app;
const express = require("express");

// const accounts = require("./routes/accounts");
// const membership = require("./routes/memberships");

const User = require("./models/User");
const Products = require("./models/Products");
const Category = require("./models/Category");
const Suppliers = require("./models/Suppliers");
const Order = require("./models/Order");
const OrderDetails = require("./models/OrderDetails");
const History = require("./models/History");
const Payment = require("./models/Payment");
const Shipping = require("./models/Shipping");

// Account.associate({Membership, Content, Saldo});
// Membership.associate({Account, Content, Patron});
// Content.associate({Account, Membership});
// Saldo.associate({ Account });
// Patron.associate({ Membership });

const app = express();

app.set("port", 3000);
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// app.use("/api", accounts);
// app.use("/api", membership);

app.listen(app.get("port"), () => {
    console.log(`Server started at http://localhost:${app.get("port")}`);
});
module.exports = app;
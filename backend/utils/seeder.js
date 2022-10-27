const Product = require("../models/product");
const dotenv = require("dotenv");
const connectDb = require("../config/database");

const products = require("../data/products");
require("colors");
// Setting dotenv file
dotenv.config({ path: "backend/config/config.env" });

connectDb();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Product are deleted".bgBlue.grey);

    await Product.insertMany(products);
    console.log("All Products are added!".bgBlue.white);

    process.exit();

  } catch (error) {
    console.log(error.message.bgRed.white);
    process.exit();
  }
};

seedProducts();

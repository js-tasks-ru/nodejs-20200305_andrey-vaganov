const Category = require('../models/Category');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const entityToJson = require('./helpers/entity-to-json');

module.exports.productsBySubcategory = async (ctx, next) => {
  const {subcategory} = ctx.request.query;

  if (!subcategory) {
    return next();
  }

  const products = await Product.find({subcategory: subcategory});
  const result = products.map(entityToJson);

  ctx.body = {
    products: result,
  };
};

module.exports.productList = async (ctx) => {
  const products = await Product.find({});

  if (!products) {
    ctx.throw(404);
  }

  const productsMap = products.map(entityToJson);

  ctx.body = {products: productsMap};
};

module.exports.productById = async (ctx) => {
  const productId = ctx.params.id;

  if (!mongoose.isValidObjectId(productId)) {
    ctx.throw(400);
  }

  const product = await Product.findById(productId);

  if (!product) {
    ctx.throw(404);
  }

  ctx.body = {product: product.toJSON()};
};


const Product = require('../models/Product');

module.exports.productsByQuery = async (ctx) => {
  const {query} = ctx.request.query;
  const res = await Product.find({$text: {$search: query}});

  ctx.body = {products: res};
};

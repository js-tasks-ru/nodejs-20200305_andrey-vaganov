const Category = require('../models/Category');
const entityToJson = require('./helpers/entity-to-json');

module.exports.categoryList = async (ctx) => {
  const categories = await Category.find({});

  const result = categories.map(entityToJson);

  ctx.body = {categories: result};
};

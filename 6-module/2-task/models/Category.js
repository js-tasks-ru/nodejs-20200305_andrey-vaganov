const mongoose = require('mongoose');
const connection = require('../libs/connection');
const jsonTransformer = require('./transformers').jsonTransformer;

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    transform: jsonTransformer,
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
}, {
  toJSON: {
    transform: jsonTransformer,
  },
});

module.exports = connection.model('Category', categorySchema);

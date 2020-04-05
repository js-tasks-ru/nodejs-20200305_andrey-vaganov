const mongoose = require('mongoose');
const connection = require('../libs/connection');
const jsonTransformer = require('./transformers').jsonTransformer;

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  images: [String],

}, {
  toJSON: {
    transform: jsonTransformer,
  },
});

module.exports = connection.model('Product', productSchema);

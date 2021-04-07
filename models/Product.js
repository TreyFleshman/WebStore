const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProductSchema = new Schema( {
  name: {
    type: String
  },
  desc: {
    type: String
  },
  price: {
    type: Number
  },
  imgURL: {
    type: String
  }
  
} );

mongoose.model('Products', ProductSchema);
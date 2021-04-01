const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CartItemSchema = new Schema( {
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

mongoose.model('CartItems', CartItemSchema);
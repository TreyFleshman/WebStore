const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CartItemSchema = new Schema( {
  user_id: {
    type: String
  },
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
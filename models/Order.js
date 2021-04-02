const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const OrderSchema = new Schema( {
  user_id: {
    type: String
  },
  order_date: {
    type: String,
    default: Date.now
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  address2: {
    type: String
  },
  country: {
    type: String
  },
  state: {
    type: String
  },
  city: {
    type: String
  },
  zip: {
    type: String
  },
  total:{
    type: Number
  },
  items:{
    type: {}
  }

} );

mongoose.model('Order', OrderSchema);
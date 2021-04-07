const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ElectronicSchema = new Schema( {
    name: {
        type: String
    },
    desc: {
        type: String
    },
    brand: {
        type: String
    },
    price: {
        type: Number
    },
    imgURL: {
        type: String
    },
    upc: {
        type: Number
    }
} );

mongoose.model('Electronics', ElectronicSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema( {
  provider: {
    type: String
  },
  providerID: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  displayName: {
    type: String
  },
  email: {
    type: String
  },
  picture: {
    type: String
  },
  providerProfile: {
    type: {}
  }
} );

mongoose.model('Users', UserSchema);
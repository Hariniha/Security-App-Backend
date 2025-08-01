const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const passwordSchema = new mongoose.Schema({
  title: String,
  username: String,
  password: {
    type: String,
    required: true,
    set: encrypt, // auto-encrypt when setting the field
    get: decrypt  // auto-decrypt when retrieving (optional)
  },
  url: String,
  notes: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  toJSON: { getters: true },  // enables the get() during JSON.stringify()
  toObject: { getters: true } // enables the get() when using toObject()
});

// Encryption function
function encrypt(password) {
  return CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();
}

// Decryption function
function decrypt(encrypted) {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, process.env.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return 'Decryption Error';
  }
}

module.exports = mongoose.model('Password', passwordSchema);

// models/Data.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UploadSchema  = new Schema({
  column1: String,
  column2: String,
  column3: String,
  column4: String,
  column5: String,
});

module.exports = mongoose.model('Upload', UploadSchema);

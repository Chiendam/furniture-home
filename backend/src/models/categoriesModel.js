const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'required field name'],
    trim: true,
    minLength: [2, 'username must have more or equal then 10 characters']
  },
  description: {
    type: String,
    trim: true,
  },
  is_active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdAt: {
    type: Date,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories"
  },
  user_create: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }
});

const categoriesModel = mongoose.model('categories', categoriesSchema);

module.exports = categoriesModel;
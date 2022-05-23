const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
      required: [true, 'required field username'],
      unique: true,
      trim: true,
      maxLength: [30, 'username must have less or equal then 40 characters'],
      minLength: [5, 'username must have more or equal then 10 characters']
  },
  password: {
    type: String,
    required: [true, 'Please tell us password'],
    minLength:[8, 'password must have more or equal then 8 characters'],
    select: false,
  },
  email: {
    type: String,
    required: [true, 'required field email'],
    unique: true,
    lowercase: true,
    // validate: [validator.isEmail, 'Please provide a valid email']
  },
  fullName: {
    type: String,
    required: [true, 'required field fullName'],
    trim: true,
    maxLength: [40, 'fullName must have less or equal then 40 characters'],
    minLength: [10, 'fullName must have more or equal then 10 characters']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please tell us passwordConfirm'],
    validate: {
        //Chay khi tao moi hoac luu
        validator: function(el) {
            return el === this.password;
        },
        messages: 'Passwords are not the same!'
    }
  },
  role: {
    type: String,
    enum: ['user', 'manager', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  passwordUpdateAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  }
});

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({active: {$ne: false}});
  next();
})

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
  let changedTimestamp;
  if (this.passwordUpdateAt) {
    changedTimestamp = parseInt(
      this.passwordUpdateAt.getTime() / 1000,
      10
      );
      return JWTTimestamp < changedTimestamp;
    }
  // False means NOT changed
  return false;
}

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const moongosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema({
  __v: { type: Number, select: false },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
});

// Encriptar contraseña cuando sea guardado
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

// Encriptar contraseña cuando sea actualizado
userSchema.pre('findOneAndUpdate', function (next) {
  const user = this;
  if (!user._update.$set.password) return next();
  bcrypt.hash(user._update.$set.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    user._update.$set.password = passwordHash;
    next();
  });
});

userSchema.plugin(moongosePaginate);
module.exports = model('User', userSchema);

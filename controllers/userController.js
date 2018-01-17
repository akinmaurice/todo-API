const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const saltRounds = 10;

const User = mongoose.model('User');


// MiddleWare to validate user data submitted to register
exports.validateRegister = (req, res, next) => {
  req.checkBody('name', 'Name field cannot be empty').notEmpty();
  req.checkBody('email', 'That Email is not valid').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('password', 'Password cannot be blank!').notEmpty();
  req.checkBody('passwordConfirm', 'Password Confirm  cannot be blank!').notEmpty();
  req.checkBody('passwordConfirm', 'Your Passwords do not match').equals(req.body.password);
  const errors = req.validationErrors();
  if (errors) {
    res.json({ status: 406, errors, message: errors[0].msg });
    return;
  }
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      req.body.hash = hash;
      req.body.salt = salt;
      next();
    });
  });
};

// Middleware to check if a user exists already with the mail
exports.checkUserExists = async (req, res, next) => {
  const user = await User.find({ email: req.body.email });
  if (user.length) {
    // STop fn from running
    res.json({ status: 406, message: 'A user with that email exists already' });
    return;
  }
  next();
};

// Middleware Controller to regsiter user
exports.registerUser = async (req, res) => {
  await (new User(req.body)).save();
  res.json({
    status: 200, message: 'Registration Successful',
  });
};


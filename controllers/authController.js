
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const User = mongoose.model('User');

// MIDDLEWARE TO CHECK LOGIN FORM IF THE USER INPUT IS VALID
exports.checkLoginInput = (req, res, next) => {
  req.checkBody('email', 'Email Field Cannot be Empty').isEmail();
  req.checkBody('password', 'Password Field Cannot be Empty').notEmpty();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ status: 406, message: 'Invalid Email/Password' });
  }
  next();
};

/*
Login Controller
Login the user here,
*/
exports.login = async (req, res) => {
  const user = await User.find({ email: req.body.email });
  if (user.length < 1) {
    return res.json({ status: 406, message: 'Invalid Email/Password' });
  }
  bcrypt.hash(req.body.password, user[0].salt, (err, hash) => {
    if (user[0].hash !== hash) {
      return res.json({ status: 406, message: 'Invalid Email/Password' });
    }
    const userDetails = {
      email: user[0].email,
      name: user[0].name,
    };
    const token = jwt.sign(userDetails, process.env.SECRET, { expiresIn: 86400 });
    res.setHeader('Set-Cookie', `${token}; HttpOnly`);
    res.json({ status: 200, token, userDetails });
  });
};

// Middle ware to rrstrict page access
exports.isLoggedIn = (req, res, next) => {
  // Check if user is authenticated get jwt from cookie
  const token = req.headers.authorization;
  if (!token) {
    return res.json({ status: 401, message: 'You must be logged in to access that page' });
  }
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.json({ status: 401, message: 'You must be logged in to visit this page' });
    }
    req.body.user = decoded;
    next();
  });
};

// MiddleWare to fetch the User ID from the JWT
exports.getUserId = async (req, res, next) => {
  const fetchUser = await User.find({ email: req.body.user.email });
  req.body.author = fetchUser[0]._id;
  next();
};


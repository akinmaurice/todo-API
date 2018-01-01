const express = require('express');

const router = express.Router();
const appController = require('../controllers/appController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

/*
GET Index
*/
router.get(
  '/',
  appController.getHome,
);

/*
GET All User Todo
*/
router.get(
  '/todos',
  authController.isLoggedIn,
  authController.getUserId,
  appController.getDataPages,
);

/*
Router to Register User
*/
router.post(
  '/user/register',
  userController.validateRegister,
  catchErrors(userController.checkUserExists),
  catchErrors(userController.registerUser),
  catchErrors(authController.login),
);

/*
Router to login User
*/
router.post(
  '/user/login',
  authController.checkLoginInput,
  authController.login,
);

/*
Route to Create New Todo
*/
router.post(
  '/todo/createTodo',
  authController.isLoggedIn,
  authController.getUserId,
  appController.validateCreateTodo,
  appController.addNewTodo,
);

// Route to get TOdo by Slug
router.get(
  '/todo/:slug',
  authController.isLoggedIn,
  authController.getUserId,
  appController.getTodoBySlug,
);


/*
Route to Update Todo
*/
router.post(
  '/todo/updateTodo',
  authController.isLoggedIn,
  authController.getUserId,
  appController.validateUpdateTodo,
  appController.updateTodo,
);


/*
Route to Delete  Todo
*/
router.post(
  '/todo/deleteTodo',
  authController.isLoggedIn,
  authController.getUserId,
  appController.deleteTodo,
);

/*
Router to Add activities to todo
*/
router.post(
  '/todo/addActivity',
  authController.isLoggedIn,
  authController.getUserId,
  appController.addActivity,
);

module.exports = router;

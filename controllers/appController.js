const mongoose = require('mongoose');

const Todo = mongoose.model('Todo');
/*
Controller to get the Home Page
*/

exports.getHome = (req, res) => {
  res.json({ status: 200, message: 'Index Endpoint Here. No authentication Needed.' });
};

/*
Controller to get the todo List
*/
exports.getAllTodos = async (req, res) => {
  const todos = await Todo.find({ author: req.body.author });
  const user = {
    email: req.body.user.email,
    name: req.body.user.name,
  };
  res.json({
    status: 200,
    user,
    todos,
  });
};

// Middleware to verify user input to Create new Todo
exports.validateCreateTodo = (req, res, next) => {
  req.checkBody('title', 'Todo Title Cannot be Empty!').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    res.json({ status: 406, errors, message: errors[0].msg });
    return;
  }
  next();
};

// Controller to Add new Todo
exports.addNewTodo = async (req, res) => {
  const todo = await (new Todo(req.body)).save();
  res.json({ status: 200, todo });
};

// Controller to get Todo By SLug
exports.getTodoBySlug = async (req, res) => {
  // Add the Author Field to ensure the Todo Belongs to the current USer
  const todo = await Todo.find({ slug: req.params.slug, author: req.body.author });
  // If none is found!
  if (!todo.length) {
    return res.json({ status: 404, message: 'No Todo Found!' });
  }
  res.json({ status: 200, todo });
};

// Middleware to verify user input to Update Todo
exports.validateUpdateTodo = (req, res, next) => {
  req.checkBody('title', 'Todo Title Cannot be Empty!').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    res.json({ status: 406, errors, message: errors[0].msg });
    return;
  }
  next();
};

// Controller to update Todo by ID sent in body
exports.updateTodo = async (req, res) => {
  // Find and Update the Todo by ID
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, author: req.body.author },
    req.body,
    { new: true, /* return the updated Todo */ runValidatos: true },
  ).exec();
  res.json({ status: 200, todo });
};

// Controller to Delete tasks by ID sent in Body
exports.deleteTodo = async (req, res) => {
  // Find and Update the Todo
  await Todo.findOneAndRemove({ _id: req.params.id, author: req.body.author }).exec();
  res.json({ status: 200, message: 'Todo Deleted' });
};


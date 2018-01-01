const mongoose = require('mongoose');
// Use global Promise for mongoose.
mongoose.Promise = global.Promise;
const slug = require('slugs');

// Make Schema(Database)
const todoSchema = new mongoose.Schema({
  title: {
    type: String, // Data type
    trim: true, // Take out white spaces from user input
    required: 'Please enter a todo Title!',
  },
  slug: String,
  activities: [String],
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author',
  },
  created: {
    type: Date,
    defualt: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

/* Auto generate slugs and pre-save before someone saves a store in the schema.
not needed for new stores only stores with changed names */
todoSchema.pre('save', async function (next) {
  if (!this.isModified('title')) {
    next(); // Skip
    return; // stop this this function back to save
  }
  /* THis takes the name of the store, run it through the schma
    and get the slug field and assign it to the output */
  this.slug = slug(this.title);
  // find stores with the same slug.
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const todoWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (todoWithSlug.length) {
    this.slug = `${this.slug}-${todoWithSlug.length + 1}`;
  }
  // Move to the next function. i.e continue to save the store
  next();
});

todoSchema.statics.getTodoList = function () {
  return this.aggregate([
    { $unwind: '$todo' },
    { $group: { _id: '$todo' } },
  ]);
};

module.exports = mongoose.model('Todo', todoSchema);

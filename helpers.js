/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/
// FS is a built in module to node that let's us read files from the system we're running on
// const fs = require('fs');

/* moment.js is a handy library for displaying dates.
We need this in our templates to display things like "Posted 5 minutes ago" */
exports.moment = require('moment');

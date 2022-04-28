#! /usr/bin/env node

console.log("This script drops your database.");
console.log("e.g.: node dropdb mongodb://localhost:27017/kochii");

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

const mongoose = require("mongoose");
const mongoDB = userArgs[0];

mongoose.connect(
  mongoDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function () {
    mongoose.connection.db.dropDatabase().finally(() => {
      console.log("Database dropped");
      // All done, disconnect from database
      mongoose.disconnect();
    });
  }
);

mongoose.connection.once("open", () =>
  console.log("mongodb: connection established")
);

mongoose.connection.once("close", () =>
  console.log("mongodb: connection closed")
);

#! /usr/bin/env node

// Filename: dropdb.js
// Description: This script drops your MongoDB database
//
// Author: Jeffrey Ram Pineda <https://jeffreyram.pineda.org/>

console.log('This script drops your MongoDB database\n');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

// Check arguments for valid MongoDB URI string
if (userArgs.length == 0 || !userArgs[0].startsWith('mongodb')) {
  console.log(
    'You need to specify a valid mongodb URI string as the first argument\n',
  );
  console.log('Usage: node dropdb <uri_string>\n');
  process.exit(0);
}

const mongoose = require('mongoose');
const uri_string = userArgs[0];

mongoose.connection.once('open', () =>
  console.log('MongoDB: connection established'),
);

mongoose.connection.once('close', () =>
  console.log('MongoDB: connection closed'),
);

mongoose.connection.on('error', () => {
  console.log('MongoDB: connection error');
  process.exit(0);
});

mongoose.connect(uri_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function dropDatabase() {
  await mongoose.connection.dropDatabase();

  console.log('MongoDB: database dropped');
}

dropDatabase()
  // All done, disconnect from database
  .finally(() => mongoose.disconnect());

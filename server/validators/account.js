const Validator = require('validator');
const Account = require('../models/account');

// Sanitizes and validates all data required to login. Throws
// an HTTP error status 401 if invalid.
async function login(body) {
  let { username = '', password = '' } = body;
  let error_messages = [];

  username = Validator.escape(username);
  password = Validator.escape(password);

  // username validation
  if (Validator.isEmpty(username)) {
    error_messages.push('Username is required');
  } else if (!Validator.isLength(username, { min: 6, max: 30 })) {
    error_messages.push('Username must be between 6 to 30 characters');
  } else if (!/^[a-zA-Z0-9_-]*$/.test(username)) {
    error_messages.push(
      'Username must contain an alphanumeric, underscore (_), or dash (-)',
    );
  } else if (!(await Account.exists({ username }))) {
    error_messages.push('Authentication failed');
  }

  // Password validation
  if (Validator.isEmpty(password)) {
    error_messages.push('Password is required');
  } else if (!Validator.isLength(password, { min: 6, max: 30 })) {
    error_messages.push('Password must be between 6 to 30 characters');
  }

  if (error_messages.length > 0) {
    throw { status: 401, error_messages: error_messages };
  }
  return { username, password };
}

// Sanitizes and validates all data required to signup.Throws
// an HTTP error status 400 if invalid.
async function signup(body) {
  let {
    username = '',
    password = '',
    email = '',
    firstName = '',
    lastName = '',
  } = body;
  let error_messages = [];

  username = Validator.escape(username);
  password = Validator.escape(password);
  email = Validator.escape(email);
  firstName = Validator.escape(firstName);
  lastName = Validator.escape(lastName);

  // username validation
  if (Validator.isEmpty(username)) {
    error_messages.push('Username is required');
  } else if (!Validator.isLength(username, { min: 6, max: 30 })) {
    error_messages.push('Username must be between 6 to 30 characters');
  } else if (!/^[a-zA-Z0-9_-]*$/.test(username)) {
    error_messages.push(
      'Username must contain an alphanumeric, underscore (_), or dash (-)',
    );
  } else if (await Account.exists({ username })) {
    error_messages.push('Username already exists');
  }

  // Password validation
  if (Validator.isEmpty(password)) {
    error_messages.push('Password is required');
  } else if (!Validator.isLength(password, { min: 6, max: 30 })) {
    error_messages.push('Password must be between 6 to 30 characters');
  }

  // Email validation
  if (Validator.isEmpty(email)) {
    error_messages.push('Email is required');
  } else if (!Validator.isEmail(email)) {
    error_messages.push('Email is invalid');
  } else if (await Account.exists({ email })) {
    error_messages.push('Email already exists');
  }

  // firstName validation
  if (!Validator.isLength(firstName, { max: 30 })) {
    error_messages.push('First name have a maximum of 30 characters');
  } else if (!/^[a-zA-Z]*$/.test(firstName)) {
    error_messages.push('First name must only contain letters');
  }

  // lastName validation
  if (!Validator.isLength(lastName, { max: 30 })) {
    error_messages.push('Last name have a maximum of 30 characters');
  } else if (!/^[a-zA-Z]*$/.test(lastName)) {
    error_messages.push('Last name must only contain letters');
  }

  if (error_messages.length > 0) {
    throw { status: 400, error_messages: error_messages };
  }
  return { username, password, email, firstName, lastName };
}

// Sanitizes and validates all data required to update. Throws
// an HTTP error status 400 if invalid.
async function update(body) {
  let { firstName = '', lastName = '' } = body;
  let error_messages = [];

  firstName = Validator.escape(firstName);
  lastName = Validator.escape(lastName);

  // firstName validation
  if (Validator.isEmpty(firstName)) {
    error_messages.push('First name is required');
  } else if (!Validator.isLength(firstName, { min: 2, max: 30 })) {
    error_messages.push('First name must be between 2 to 30 characters');
  } else if (!/^[a-zA-Z]*$/.test(firstName)) {
    error_messages.push('First name must only contain letters');
  }

  // lastName validation
  if (Validator.isEmpty(lastName)) {
    error_messages.push('Last name is required');
  } else if (!Validator.isLength(lastName, { min: 2, max: 30 })) {
    error_messages.push('Last name must be between 2 to 30 characters');
  } else if (!/^[a-zA-Z]*$/.test(lastName)) {
    error_messages.push('Last name must only contain letters');
  }

  if (error_messages.length > 0) {
    throw { status: 400, error_messages: error_messages };
  }
  return { firstName, lastName };
}

// Sanitizes and validates all data required to verify an email. Throws
// an HTTP error status 400 if invalid.
async function verify(query) {
  let { token = '', email = '' } = query;
  let error_messages = [];

  token = Validator.escape(token);
  email = Validator.escape(email);

  // Token validation
  if (Validator.isEmpty(token)) {
    error_messages.push('Token is required');
  } else if (!Validator.isLength(token, { min: 16, max: 16 })) {
    error_messages.push('Token is invalid');
  }

  // Email validation
  if (Validator.isEmpty(email)) {
    error_messages.push('Email is required');
  } else if (!Validator.isEmail(email)) {
    error_messages.push('Email is invalid');
  }

  if (error_messages.length > 0) {
    throw { status: 400, error_messages: error_messages };
  }
  return { token, email };
}

module.exports = {
  login,
  signup,
  verify,
  update,
};

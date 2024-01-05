// Utility function to send consistent responses
const sendResponse = (res, statusCode, data) => {
  res.status(statusCode).send(data);
};

// Utility function to throw consistent exceptions/errors
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = { sendResponse, createError };

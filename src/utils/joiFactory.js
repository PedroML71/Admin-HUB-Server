const validator = require("express-joi-validation").createValidator({
  // This options forces validation to pass any errors the express
  // error handler instead of generating a 400 error
  passError: true,
});

const joiFactory = (schema, property) => {
  return validator[property](schema);
};

module.exports = joiFactory;

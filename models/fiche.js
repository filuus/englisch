const connection = require("../config/db");

module.exports.getAllFiches = () => {
  return connection.promise().query("SELECT * FROM words");
};

module.exports.quantityOfWords = () => {
  return connection.promise().query("SELECT COUNT(*) FROM words");
};

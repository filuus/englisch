const connection = require("../config/db");

module.exports.getAllBunches = () => {
  return connection.promise().query("SELECT name FROM bunches");
};

module.exports.quantityOfBunches = () => {
  return connection.promise().query("SELECT COUNT(*) FROM bunches");
};

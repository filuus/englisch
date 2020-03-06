const connection = require("../config/db");

module.exports.create = async user => {
  connection.query("INSERT INTO users (email, password) VALUES (?, ?)", [
    user.email,
    user.password
  ]);
};

module.exports.findByEmail = user => {
  return connection
    .promise()
    .query("SELECT * FROM users WHERE email = ?", [user.email]);
};

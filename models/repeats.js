const connection = require("../config/db");

module.exports.getWord = (userId, wordId) => {
  return connection
    .promise()
    .query("INSERT INTO repeats (id_word, id_user) VALUES (?, ?)", [
      wordId,
      userId
    ]);
};

module.exports.takeWord = (userId, wordId) => {
  return connection
    .promise()
    .query(
      "SELECT id, id_user, id_word, quantity_of_repeat FROM repeats WHERE id_user = ? AND id_word = ?",
      [userId, wordId]
    );
};

module.exports.getFiches = (userId, sectionId, level, limit) => {
  return connection
    .promise()
    .query(
      "SELECT words.id, words.word, words.translate, words.sentence, words.translate_sentence, words.id_section, words.level FROM repeats JOIN words ON repeats.id_word = words.id WHERE repeats.id_user = ? AND repeats.quantity_of_repeat = ? AND words.id_section = ? AND words.level = ? LIMIT ?",
      [userId, 99, sectionId, level, limit]
    );
};

module.exports.updateRepeat = (userId, wordId, quantityOfRepeat) => {
  return connection
    .promise()
    .query(
      "UPDATE repeats SET quantity_of_repeat = ?  WHERE id_user = ? AND id_word = ?",
      [quantityOfRepeat, userId, wordId]
    );
};

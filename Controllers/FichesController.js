const Fiche = require("../models/fiche");
const Repeats = require("../models/repeats");

exports.show = (req, res) => {
  Fiche.getAllFiches().then(function([rows, fields]) {
    res.render("fiches/show", {
      idBunch: req.params.idBunch
    });
  });
};

exports.getAllFiches = (req, res) => {
  console.log(req.params);
  Repeats.getFiches(
    req.session.user.id,
    parseInt(req.params.idBunch),
    req.params.level,
    parseInt(req.params.qwords)
  ).then(function([rows, fields]) {
    res.send(rows);
  });
};

exports.addRepeats = (req, res) => {
  // console.log(req.body);
  req.body.forEach(element => {
    Repeats.takeWord(req.session.user.id, element.id).then(([rows, fields]) => {
      console.log(rows[0].quantity_of_repeat);
      if (rows[0].quantity_of_repeat === 99) {
        Repeats.updateRepeat(req.session.user.id, element.id, 5);
      } else {
        Repeats.updateRepeat(
          req.session.user.id,
          element.id,
          rows[0].quantity_of_repeat - 1
        );
      }
    });
  });
  res.send({ status: "succes" });
};

exports.calcPercent = (req, res) => {
  const quantityOfAll = Repeats.getAllFichesCount(
    req.session.user.id,
    req.params.idBunch,
    req.session.user.level
  );
  const quantityOfLearn = Repeats.getLearnFichesCount(
    req.session.user.id,
    req.params.idBunch,
    req.session.user.level
  );
  Promise.all([quantityOfAll, quantityOfLearn]).then(
    ([[rowsAll, fieldsAll], [rowsLearn, fieldsLearn]]) => {
      let result = 0;
      console.log(rowsAll[0][`count(*)`], rowsLearn[0][`count(*)`]);
      if (rowsAll[0][`count(*)`] != 0) {
        console.log("weszlo");
        result = rowsLearn[0][`count(*)`] / rowsAll[0][`count(*)`];
      }
      res.send({ result: result });
    }
  );
};

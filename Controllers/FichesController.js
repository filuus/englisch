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
    Repeats.getWord(req.session.user.id, element.id).then(([rows, fields]) => {
      console.log(rows);
      Repeats.updateRepeat(req.session.user.id, element.id, 6);
    });
  });
  res.send({ status: "succes" });
};

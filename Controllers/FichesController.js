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
  console.log(req.body);
  // Repeats.updateRepeat(1, 1, 5);
  return { status: "succes" };
};

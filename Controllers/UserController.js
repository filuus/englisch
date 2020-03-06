const User = require("../models/user");
const Repeats = require("../models/repeats");
const Fiche = require("../models/fiche");
const { check, validationResult } = require("express-validator");

exports.showLoginPage = (req, res) => {
  res.render("auth/login", {
    formMessage: req.flash("form")
  });
};

exports.login = (req, res) => {
  User.findByEmail({
    email: req.body.email_adress
  }).then(function([rows, fields]) {
    console.log(rows[0]);
    if (rows.length > 0) {
      if (rows[0].password === req.body.password) {
        req.flash(`form`, `Siema ${req.body.email_adress}`);
        req.session.loggedin = true;
        req.session.user = {
          id: null,
          email: null,
          level: null,
          limitWords: null
        };
        req.session.user.id = rows[0].id;
        req.session.user.email = rows[0].email;
        req.session.user.level = rows[0].level;
        req.session.user.limitWords = rows[0].quantity_of_words;
        res.redirect("/");
      } else {
        req.flash(`form`, `Incorrect password`);
        res.redirect("/login");
      }
    } else {
      req.flash(`form`, `Incorrect email`);
      res.redirect("/login");
    }
  });
};

exports.showRegisterPage = (req, res) => {
  res.render("auth/register", {
    formMessage: req.flash("form")
  });
};

exports.register = (req, res, next) => {
  User.create({
    email: req.body.email_adress,
    password: req.body.password
  })
    .then(function() {
      const user = User.findByEmail({
        email: req.body.email_adress
      });
      const quantityOfWords = Fiche.quantityOfWords();
      Promise.all([user, quantityOfWords]).then(
        ([resultUser, resultQuantity]) => {
          const countOfWords = resultQuantity[0][0]["COUNT(*)"];
          const userId = resultUser[0][0].id;
          let tabOfPromise = [];
          for (let i = 2; i < countOfWords + 1; i++) {
            tabOfPromise.push(Repeats.getWord(userId, i));
          }
          Promise.all(tabOfPromise).then(() => {
            req.flash(`form`, `Zostałeś poprawnie zarejestrowany`);
            res.redirect("/login");
          });
        }
      );
    })
    .catch(function(err) {
      req.flash(`form`, `Ooops, Something went wrong`);
      res.redirect("/register");
    });
};

exports.loguot = (req, res) => {
  req.session.loggedin = false;
  req.session.user.id = null;
  req.session.user.email = null;
  req.session.user.level = null;
  req.session.user.limitWords = null;
  res.redirect("/login");
};

exports.validate = [
  check("email_adress")
    .isLength({ min: 1 })
    .withMessage("Name is required"),
  check("password")
    .isLength({ min: 1 })
    .withMessage("Password is required")
];

exports.checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("auth/register", {
      validated: req.body,
      errors: errors.mapped()
    });
  }
  next();
};

const express = require("express");
const router = express.Router();
const Bunches = require("../models/bunches");
const UserController = require("../Controllers/UserController");
const MainController = require("../Controllers/MainController");
const FichesController = require("../Controllers/FichesController");

function checkAuth(req, res, next) {
  if (
    !req.session.loggedin &&
    req.url !== "/login" &&
    req.url !== "/register"
  ) {
    res.redirect("/login");
  }
  next();
}

function getUser(req, res, next) {
  res.locals.user = req.session.user;
  next();
}

function getBunches(req, res, next) {
  let bunches = [];
  Bunches.getAllBunches().then(([rows, fields]) => {
    for (let i = 0; i < rows.length; i++) {
      bunches.push(rows[i].name);
    }
    console.log(bunches);
    res.locals.bunches = bunches;
    next();
  });
}

router.use(checkAuth);
router.use(getUser);
router.use(getBunches);

router.get("/login", UserController.showLoginPage);
router.get("/register", UserController.showRegisterPage);

router.get("/", MainController.home);

router.post("/login", UserController.login);

router.post(
  "/register",
  UserController.validate,
  UserController.checkValidation,
  UserController.register
);
router.get("/logout", UserController.loguot);
router.get("/fiches/:idBunch/show", FichesController.show);

router.get(
  "/fiches/:idBunch/play/:level/:qwords",
  FichesController.getAllFiches
);

router.post("/fiches/addRepeats", FichesController.addRepeats);

router.get("/fiches/:idBunch/calcPercent", FichesController.calcPercent);

module.exports = router;

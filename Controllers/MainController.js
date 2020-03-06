exports.home = (req, res) => {
  res.render("dashboard", {
    formMessage: req.flash("form"),
    email: req.session.user.email
  });
};

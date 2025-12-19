function isLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
}

function isStudent(req, res, next) {
  if (req.session.role !== "student") {
    return res.send("Hanya untuk student");
  }
  next();
}

function isTeacher(req, res, next) {
  // Middleware di DB: Apakah jabatannya Teacher?
  if (req.session.role !== "teacher") {
    return res.send("Hanya untuk teacher");
  }
  next();
}

module.exports = { isLogin, isStudent, isTeacher };

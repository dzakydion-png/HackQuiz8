const express = require("express");
const session = require("express-session");

const indexRouter = require("./routes/index");
const studentRouter = require("./routes/studentRouter");
const teacherRouter = require("./routes/teacherRouter");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// session middleware
app.use(
  session({
    secret: "rahasia-bootcamp",
    resave: false,
    saveUninitialized: true,
  })
);

// bikin session tersedia di semua EJS
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

const isLoggedIn = (req, res, next) => {
  if (!req.session.userId) { // <-- Mengecek apakah data session ada?
    return res.redirect('/');
  }
  next();
};

// Router utama (tanpa /home)
app.use("/", indexRouter);

// k bawah udah login

app.use("/student", isLoggedIn, studentRouter);
app.use("/teacher", isLoggedIn, teacherRouter);

// Kompatibilitas URL lama (/home/...)
// contoh: /home/student/8/category/1 -> redirect ke /student/8/category/1
app.use("/home/student", (req, res) => {
  return res.redirect(301, req.originalUrl.replace("/home", ""));
});
app.use("/home/teacher", (req, res) => {
  return res.redirect(301, req.originalUrl.replace("/home", ""));
});

// 404 fallback (biar tahu salah path)
app.use((req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.originalUrl}`);
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
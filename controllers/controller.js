const { User, Category, Course, Exercise, Score, Profile } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const quiz = require("../helpers/quiz");

class Controller {
  // HOME
  static async home(req, res) {
    try {
      const { search } = req.query;
      const option = { include: Category };

      if (search) {
        option.where = { name: { [Op.iLike]: `%${search}%` } };
      }

      const courses = await Course.findAll(option);
      res.render("home", { courses, search, session: req.session });
    } catch (error) {
      console.log(" Home error:", error);
      res.send(error.message);
    }
  }

  static async categories(req, res) {
    try {
      const categories = await Category.findAll({ include: [Course] });
      res.render("categories", { categories, session: req.session });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async coursesByCategory(req, res) {
    try {
      const { userId, categoryId } = req.params;

      const courses = await Course.findAll({
        where: { categoryId }, //  huruf kecil sesuai kolom di DB
      });

      res.render("coursesByCategory", {
        courses,
        userId,
        categoryId,
        session: req.session,
      });
    } catch (error) {
      console.log(" coursesByCategory error:", error);
      res.send(error.message);
    }
  }

  // AUTH
  static loginForm(req, res) {
    res.render("login", { errors: [] });
  }

  static async loginPost(req, res) {
    try {
      const { email, password } = req.body;
      // validasi
      if (!email || !password) throw new Error("Email & password wajib diisi!");

      const user = await User.findOne({
        where: { email: (email || "").trim() },
      });
      if (!user) throw new Error("User tidak ditemukan!")

      const valid = bcrypt.compareSync(password, user.password);
      if (!valid) throw new Error("Password salah!");

      req.session.userId = user.id;
      req.session.role = user.role;

      if (user.role === "student") return res.redirect(`/student/${user.id}`);
      return res.redirect(`/teacher/${user.id}`);
    } catch (error) {
      res.render("login", { errors: [error.message] });
    }
  }

  static registerForm(req, res) {
    res.render("register", { errors: [] });
  }

  static async registerPost(req, res) {
    // promise chaining
    try {
      let { username, email, password } = req.body;
      let role = 'student';
      if (!email) throw new Error("Email tidak boleh kosong!");
      if (!password) throw new Error("Password tidak boleh kosong!");
      if (password.length < 8) throw new Error("Password minimal 8 karakter!");

      const existing = await User.findOne({ where: { email } });
      if (existing) throw new Error("Email sudah terdaftar!");

      await User.create({ username, email, password, role });
      res.redirect("/login");
    } catch (error) {
      let messages =
        error.name === "SequelizeValidationError"
          ? error.errors.map((e) => e.message)
          : [error.message];
      res.render("register", { errors: messages });
    }
  }

  //Middleware Dihapus saat Logout.
  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.log(" Logout error:", err);
        return res.send("Gagal logout");
      }
      res.redirect("/login");
    });
  }

  // STUDENT
  static async homeStudent(req, res) {
    try {
      const { studentId } = req.params;
      const categories = await Category.findAll();
      res.render("homeStudent", {
        categories,
        userId: studentId,
        session: req.session,
      });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async exercisesByCourse(req, res) {
    try {
      const { userId, courseId } = req.params;

      const exercises = await Exercise.findAll({
        include: {
          model: Course,
          where: { id: courseId }, //  filter berdasarkan Course.id
        },
      });

      res.render("exercises", {
        exercises,
        userId,
        courseId,
        session: req.session,
      });
    } catch (error) {
      console.log(" exercisesByCourse error:", error);
      res.send(error.message);
    }
  }

  static async submitExercises(req, res) {
    try {
      const { userId, courseId } = req.params;
      const exercises = await Exercise.findAll({
        include: { model: Course, where: { id: courseId } },
      });

      // Gunakan quiz helper
      const quizData = quiz.create(exercises);
      const { score, details } = quiz.evaluate(quizData, req.body);

      // Simpan score ke database
      for (let i = 0; i < details.length; i++) {
        await Score.create({
          userId: +userId,
          exerciseId: quizData[i].id,
          finalScore: details[i].isCorrect ? 1 : 0,
        });
      }

      res.render("result", {
        userId,
        score: score * 10,
        total: exercises.length,
        details,
        session: req.session,
      });
    } catch (error) {
      console.log(" submitExercises error:", error);
      res.send(error.message);
    }
  }

  // TEACHER
  static async homeTeacher(req, res) {
    try {
      const { teacherId } = req.params;

      //Sequential Await. Baris Await keDua tidak akan berjalan sampai baris pertama selesai.
      // ambil skor mentah
      const scoresRaw = await Score.findAll({
        include: [
          { model: User },
          {
            model: Exercise,
            include: { model: Course, include: Category },
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const categories = await Category.findAll({
        include: { model: Course, include: [Exercise] },
      });

      // Data untuk chart
      const chartDataPerCategory = [];
      categories.forEach((cat) => {
        const studentScores = {};
        scoresRaw.forEach((s) => {
          //ternery
          if (s.Exercise?.Course?.Category?.name === cat.name) {
            const email = s.User?.email || "Unknown";
            if (!studentScores[email]) studentScores[email] = 0;
            studentScores[email] += s.nilaiFinal; // getter *10
          }
        });
        chartDataPerCategory.push({
          name: cat.name,
          labels: Object.keys(studentScores),
          scores: Object.values(studentScores),
        });
      });

      // Data untuk tabel: akumulasi per siswa per kategori 
      const grouped = new Map();
      for (const s of scoresRaw) {
        const email = s.User?.email || "Unknown";
        const catName = s.Exercise?.Course?.Category?.name || "Unknown";
        const key = `${email}|${catName}`;

        if (!grouped.has(key)) {
          grouped.set(key, {
            User: { email },
            Exercise: { Course: { Category: { name: catName } } },
            nilaiFinal: 0,
          });
        }
        grouped.get(key).nilaiFinal += s.nilaiFinal;
      }

      const scores = Array.from(grouped.values());

      res.render("homeTeacher", {
        teacherId,
        categories,
        scores, //  sudah total (misal 4 benar → 40)
        chartDataPerCategory,
        session: req.session,
      });
    } catch (error) {
      console.log(" homeTeacher error:", error);
      res.send(error.message);
    }
  }

  // TEACHER
  static async addExerciseForm(req, res) {
    try {
      const { teacherId } = req.params;

      //  pastikan Course ikut diambil, biar select di EJS ada isi
      const categories = await Category.findAll({
        include: [Course],
      });

      res.render("addExercise", {
        teacherId,
        categories,
        session: req.session,
      });
    } catch (error) {
      console.log(" addExerciseForm error:", error);
      res.send(error.message);
    }
  }

  static async addExercisePost(req, res) {
    try {
      const { teacherId } = req.params;
      const { question, answerKey, courseId } = req.body;

      console.log("REQ BODY:", req.body); // cek hasil form

      if (!courseId) throw new Error("Course wajib dipilih!");

      await Exercise.create({
        question,
        answerKey,
        courseId: +courseId, //  huruf kecil
      });

      res.redirect(`/teacher/${teacherId}`);
    } catch (error) {
      console.log(" addExercisePost error:", error);
      res.send(error.message);
    }
  }

  static async editExerciseForm(req, res) {
    try {
      const { teacherId, exerciseId } = req.params;

      const exercise = await Exercise.findByPk(exerciseId, { include: Course });
      const categories = await Category.findAll({ include: Course });

      if (!exercise) return res.status(404).send("Soal tidak ditemukan");

      res.render("editExercise", {
        teacherId,
        exercise,
        categories,
        session: req.session,
      });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async editExercisePost(req, res) {
    try {
      const { teacherId, exerciseId } = req.params;
      const { question, answerKey, courseId } = req.body;

      await Exercise.update(
        { question, answerKey, courseId: +courseId }, //  courseId huruf kecil
        { where: { id: exerciseId } }
      );

      res.redirect(`/teacher/${teacherId}`);
    } catch (error) {
      res.send(error.message);
    }
  }

  static async deleteExercise(req, res) {
    try {
      const { teacherId, exerciseId } = req.params;
      await Exercise.destroy({ where: { id: exerciseId } });
      res.redirect(`/teacher/${teacherId}`);
    } catch (error) {
      res.send(error.message);
    }
  }

  // PROFILE
  static async viewProfile(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId, {
        include: [Profile, Category]
      });

      if (!user) {
        return res.status(404).send("User tidak ditemukan");
      }

      res.render("profile", {
        user,
        profile: user.Profile,
        userId,
        session: req.session,
      });
    } catch (error) {
      console.log(" viewProfile error:", error);
      res.send(error.message);
    }
  }

  static async editProfileForm(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId, {
        include:[Profile, Category],
      });

      // 2. Ambil data Category yang tersedia di database (untuk pilihan)
      const allCategories = await Category.findAll();

      if (!user) {
        return res.status(404).send("User tidak ditemukan");
      }

      res.render("editProfile", {
        user,
        profile: user.Profile,
        allCategories,
        userId,
        errors: [],
        session: req.session,
      });
    } catch (error) {
      console.log(" editProfileForm error:", error);
      res.send(error.message);
    }
  }

  static async updateProfile(req, res) {
    try {
      const { userId } = req.params;
      const { fullName, alamat, lastEducation, categoryIds } = req.body;

      const user = await User.findByPk(userId, {
        include: [Profile],
      });

      if (!user) {
        return res.status(404).send("User tidak ditemukan");
      }

      // if (user.Profile) {
      //   // Update profile yang sudah ada
      //   await Profile.update(
      //     { fullName, alamat, lastEducation },
      //     { where: { userId } }
      //   );
      // } else {
      //   // Buat profile baru
      //   await Profile.create({
      //     fullName,
      //     alamat,
      //     lastEducation,
      //     userId,
      //   });
      // }


      if (categoryIds) {
      // Magic Method: setCategories akan me-reset dan isi ulang sesuai array
      await user.setCategories(categoryIds); 
    } else {
      // Jika tidak ada yang dicentang, hapus semua minat user ini
      await user.setCategories([]); 
    }

      res.redirect(`/${user.role}/${userId}/profile`);
    } catch (error) {
      console.log(" updateProfile error:", error);

      const user = await User.findByPk(req.params.userId, {
        include: [Profile],
      });

      let messages =
        error.name === "SequelizeValidationError"
          ? error.errors.map((e) => e.message)
          : [error.message];

      res.render("editProfile", {
        user,
        profile: user.Profile,
        userId: req.params.userId,
        errors: messages,
        session: req.session,
      });
    }
  }
}

module.exports = Controller;

const express = require("express");
const Controller = require("../controllers/controller");
const { isTeacher } = require("../middlewares/auth");
const router = express.Router();


// HOME TEACHER

router.get("/:teacherId", isTeacher, Controller.homeTeacher);

// PROFILE
router.get("/:userId/profile", Controller.viewProfile);
router.get("/:userId/profile/edit", Controller.editProfileForm);
router.post("/:userId/profile/edit", Controller.updateProfile);

// ADD EXERCISE
router.get("/:teacherId/exercise/add", Controller.addExerciseForm);
router.post("/:teacherId/exercise/add", Controller.addExercisePost);

// EDIT EXERCISE
router.get(
  "/:teacherId/exercise/:exerciseId/edit",
  Controller.editExerciseForm
);
router.post(
  "/:teacherId/exercise/:exerciseId/edit",
  Controller.editExercisePost
);

// DELETE EXERCISE
// form pakai POST
router.post(
  "/:teacherId/exercise/:exerciseId/delete",
  Controller.deleteExercise
);

// optional, kalau ada link lama pakai GET
router.get(
  "/:teacherId/exercise/:exerciseId/delete",
  Controller.deleteExercise
);

module.exports = router;

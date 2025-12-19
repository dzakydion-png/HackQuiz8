const express = require("express");
const Controller = require("../controllers/controller");

const router = express.Router();


router.get("/:studentId", Controller.homeStudent);

// Profile routes
router.get("/:userId/profile", Controller.viewProfile);
router.get("/:userId/profile/edit", Controller.editProfileForm);
router.post("/:userId/profile/edit", Controller.updateProfile);

// Courses by category
router.get("/:userId/category/:categoryId", Controller.coursesByCategory);

// Exercises by course
router.get("/:userId/course/:courseId", Controller.exercisesByCourse);

// Submit answers
router.post("/:userId/course/:courseId/submit", Controller.submitExercises);

module.exports = router;

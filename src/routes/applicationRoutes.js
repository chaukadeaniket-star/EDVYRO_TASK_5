const express = require("express");

const {
  listInternships,
  submitApplication
} = require("../controllers/applicationController");

const validateApplication = require("../middleware/validateApplication");

const router = express.Router();

router.get("/internships", listInternships);

router.post(
  "/applications",
  validateApplication,
  submitApplication
);

module.exports = router;
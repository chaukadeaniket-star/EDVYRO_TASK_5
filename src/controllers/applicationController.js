
const {
  getInternships,
  createApplication
} = require("../services/applicationService");

// GET /api/internships
function listInternships(req, res, next) {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.slice(0, 100)
        : "";

    const internships = getInternships(search);

    res.status(200).json({
      success: true,
      count: internships.length,
      data: internships
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/applications
function submitApplication(req, res, next) {
  try {
    const application = createApplication(req.body);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      data: application
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listInternships,
  submitApplication
};

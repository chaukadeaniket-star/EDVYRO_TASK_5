
function validateApplication(req, res, next) {
  const { fullName, email, skills, internshipId } = req.body || {};

  const errors = [];

  // Validate full name
  if (
    typeof fullName !== "string" ||
    fullName.trim().length < 2 ||
    fullName.trim().length > 100
  ) {
    errors.push("Full name must contain between 2 and 100 characters.");
  }

  // Validate email
  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    errors.push("Please provide a valid email address.");
  }

  // Validate skills
  if (
    typeof skills !== "string" ||
    skills.trim().length < 2 ||
    skills.trim().length > 500
  ) {
    errors.push("Skills must contain between 2 and 500 characters.");
  }

  // Validate internship ID
  if (
    !(
      (typeof internshipId === "number" ||
        (typeof internshipId === "string" &&
          internshipId.trim() !== "")) &&
      Number.isSafeInteger(Number(internshipId)) &&
      Number(internshipId) > 0
    )
  ) {
    errors.push("Please select a valid internship.");
  }

  // Reject invalid requests
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Application validation failed.",
      errors
    });
  }

  next();
}

module.exports = validateApplication;


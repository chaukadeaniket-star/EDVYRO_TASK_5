
const fs = require("fs");
const path = require("path");
const db = require("../config/database");

const recordsPath = path.join(__dirname, "../../data/applications.json");

function getInternships(search = "") {
  const fileContent = fs.readFileSync(recordsPath, "utf8");
  const data = JSON.parse(fileContent);

  const query = search.trim().toLowerCase();

  if (!query) {
    return data.internships;
  }

  return data.internships.filter((internship) => {
    const searchableText = [
      internship.title,
      internship.company,
      internship.location,
      ...internship.skills
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });
}

function createApplication({ fullName, email, skills, internshipId }) {
  const internship = getInternships().find(
    (item) => item.id === Number(internshipId)
  );

  if (!internship) {
    const error = new Error("Selected internship does not exist.");
    error.statusCode = 400;
    throw error;
  }

  const statement = db.prepare(`
    INSERT INTO applications (fullName, email, skills, internshipId)
    VALUES (@fullName, @email, @skills, @internshipId)
  `);

  const result = statement.run({
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    skills: skills.trim(),
    internshipId: Number(internshipId)
  });

  return {
    id: Number(result.lastInsertRowid),
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    skills: skills.trim(),
    internshipId: Number(internshipId),
    internshipTitle: internship.title
  };
}

module.exports = {
  getInternships,
  createApplication
};


const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const applicationRoutes = require("./routes/applicationRoutes");
const errorHandler = require("./middleware/errorHandler");

// Initialize Express
const app = express();

// Secure HTTP response headers
app.use(helmet());

// Parse JSON request bodies
app.use(express.json({ limit: "10kb" }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// Rate limiting
const apiLimiter = rateLimit({
windowMs: 15 * 60 * 1000,
limit: 100,
standardHeaders: "draft-8",
legacyHeaders: false,
message: {
success: false,
message: "Too many requests. Please try again later."
}
});

app.use("/api", apiLimiter);

// Health check
app.get("/api/health", (req, res) => {
res.status(200).json({
success: true,
message: "Secure Application Integration API is running."
});
});

// API routes
app.use("/api", applicationRoutes);

// Serve frontend files
app.use(express.static(path.join(__dirname, "../public")));

// Handle unknown API routes
app.use("/api", (req, res) => {
res.status(404).json({
success: false,
message: "API endpoint not found."
});
});

// Central error handler
app.use(errorHandler);

// Start server only when this file is executed directly
if (require.main === module) {
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
console.log(`Health check: http://localhost:${PORT}/api/health`);
});
}

module.exports = app;

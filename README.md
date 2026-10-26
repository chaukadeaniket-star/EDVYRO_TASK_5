# EdVyro — Secure Application Integration

A secure internship application portal built with HTML, CSS, JavaScript, Node.js, Express, and SQLite.

## Features

* Responsive internship portal.
* Internship listing and search.
* Internship application submission.
* Server-side input validation.
* Secure HTTP headers using Helmet.
* API rate limiting.
* SQLite database storage.
* Centralized error handling.
* Automated API tests using Vitest and Supertest.

## Technology Stack

| Technology         | Purpose                  |
| ------------------ | ------------------------ |
| HTML5              | Frontend structure       |
| CSS3               | Responsive styling       |
| JavaScript         | Frontend functionality   |
| Node.js            | JavaScript runtime       |
| Express            | Backend API              |
| SQLite             | Application data storage |
| Helmet             | HTTP security headers    |
| express-rate-limit | API rate limiting        |
| Vitest             | Automated testing        |
| Supertest          | HTTP endpoint testing    |

## Project Structure

```text
secure-application-integration/
├── data/
│   ├── applications.db
│   └── applications.json
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── applicationController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validateApplication.js
│   ├── routes/
│   │   └── applicationRoutes.js
│   ├── services/
│   │   └── applicationService.js
│   └── server.js
├── tests/
│   └── application.test.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

Install the following:

* Node.js and npm
* Visual Studio Code (recommended)

## Installation

Clone your repository or open the project folder in VS Code.

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root with:

```dotenv
NODE_ENV=development
PORT=3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Run the Application

Start the backend:

```bash
npm start
```

Open the application:

http://localhost:3000/

## API Endpoints

### 1. Health Check

**GET** `/api/health`

Checks whether the API is running.

### 2. List Internships

**GET** `/api/internships`

Returns available internships.

Search by title, company, location, or skill:

```text
/api/internships?search=Frontend
```

### 3. Submit an Application

**POST** `/api/applications`

Example JSON request:

```json
{
  "fullName": "Test Student",
  "email": "student@example.com",
  "skills": "HTML, CSS, JavaScript",
  "internshipId": 1
}
```

A successful request returns HTTP status `201`.

### 4. Unknown API Endpoints

Unknown API endpoints return HTTP status `404`.

## Run Automated Tests

Run the test suite:

```bash
npm test
```

Tests cover the health check, internship listing, searching, application submission, invalid input, and unknown endpoints.

## Security Features

* Helmet adds security-related HTTP headers.
* Rate limiting helps reduce excessive API requests.
* Server-side validation checks application input.
* JSON request bodies have a size limit.
* Centralized error handling provides consistent API errors.
* Environment variables are kept outside version control.
* SQLite stores submitted applications locally.

## Database

Application records are stored in:

`data/applications.db`

SQLite manages its associated WAL files when WAL mode is enabled.

Do not commit database files containing personal information.

## Development Notes

* The application must be running for API requests to succeed.
* The `.env.example` file documents configuration variables.
* The `.env` file contains the local configuration.
* Test the application locally before deployment.

## License

This project is developed for educational and internship purposes.

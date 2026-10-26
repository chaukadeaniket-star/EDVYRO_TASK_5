
import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";

import app from "../src/server.js";
import db from "../src/config/database.js";

describe("Secure Application Integration API", () => {
  beforeEach(() => {
    db.prepare("DELETE FROM applications").run();
  });

  describe("GET /api/health", () => {
    it("should return a successful health check", async () => {
      const response = await request(app).get("/api/health");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("API is running");
    });
  });

  describe("GET /api/internships", () => {
    it("should return the list of internships", async () => {
      const response = await request(app).get("/api/internships");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should filter internships by search term", async () => {
      const response = await request(app)
        .get("/api/internships")
        .query({ search: "Frontend" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);

      expect(
        response.body.data.every((item) =>
          item.title.toLowerCase().includes("frontend")
        )
      ).toBe(true);
    });
  });

  describe("POST /api/applications", () => {
    it("should submit a valid internship application", async () => {
      const response = await request(app)
        .post("/api/applications")
        .send({
          fullName: "Test Student",
          email: "student@example.com",
          skills: "HTML, CSS, JavaScript",
          internshipId: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.email).toBe("student@example.com");
    });

    it("should reject an invalid email address", async () => {
      const response = await request(app)
        .post("/api/applications")
        .send({
          fullName: "Test Student",
          email: "invalid-email",
          skills: "HTML, CSS",
          internshipId: 1,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it("should reject an invalid internship ID", async () => {
      const response = await request(app)
        .post("/api/applications")
        .send({
          fullName: "Test Student",
          email: "student@example.com",
          skills: "HTML, CSS",
          internshipId: 99999,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should reject a request with missing fields", async () => {
      const response = await request(app)
        .post("/api/applications")
        .send({
          fullName: "Test Student",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe("Unknown API routes", () => {
    it("should return 404 for an unknown API endpoint", async () => {
      const response = await request(app).get("/api/unknown-endpoint");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});


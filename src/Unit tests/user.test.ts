// import supertest module to test express routes
import request from "supertest";

// import database configuration and models from model module
import { sequelize, User } from "../models/model";

// Import express module
import express from "express";

// Import all error handler methods from errorHandler module
import { invalidRoute, invalidJSON } from "../utils/errorHandler";

// Import Router method
import route from "../routes/route";

// Initialize an Express application
export const app = express();

// Handle existing routes after base URL
app.use(route);

// Middleware to handle invalid routes
app.use(invalidRoute);

// Middleware to handle invalid JSON structure
app.use(invalidJSON);

beforeAll(async () => {
  // Reset DB before each test
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close the connection after tests
  await sequelize.close();
});

describe("User API Endpoints", () => {
  it("should create a new user", async () => {
    const response = await request(app).post("/users").send({
      userID: 1,
      userName: "Amr",
      email: "amr@gmail.com",
      password: "asdsad123455666",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "User created successfully"
    );
    expect(response.body.user).toHaveProperty("userID", 1);
    expect(response.body.user).toHaveProperty("userName", "Amr");
    expect(response.body.user).toHaveProperty("email", "amr@gmail.com");
  });

  it("should not create a new user because invalid userID", async () => {
    const response = await request(app).post("/users").send({
      userID: "1",
      userName: "Amr",
      email: "amr@gmail.com",
      password: "asdsad123455666",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid body request");
    expect(response.body).toHaveProperty(
      "message",
      "'userID' must be a number"
    );
  });

  //   it("should return error when creating a user with existing email", async () => {
  //     await User.create({ name: "Jane Doe", email: "jane@example.com" });

  //     const response = await request(app)
  //       .post("/api/users")
  //       .send({ name: "John Doe", email: "jane@example.com" });

  //     expect(response.status).toBe(500);
  //     expect(response.body).toHaveProperty("error");
  //   });

  //   it("should delete a user", async () => {
  //     const user = await User.create({
  //       name: "Test User",
  //       email: "test@example.com",
  //     });

  //     const response = await request(app).delete(`/api/users/${user.id}`);

  //     expect(response.status).toBe(200);
  //     expect(response.body).toHaveProperty(
  //       "message",
  //       "User deleted successfully"
  //     );
  //   });

  //   it("should return error if user not found during deletion", async () => {
  //     const response = await request(app).delete("/api/users/99999"); // Non-existent user ID

  //     expect(response.status).toBe(404);
  //     expect(response.body).toHaveProperty("error", "User not found");
  //   });

  // end descripe
});

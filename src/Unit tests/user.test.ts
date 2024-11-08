// import supertest module to test express routes
import request from "supertest";

// import database configuration and models from model module
import { sequelize } from "../models/model";

// Import express module
import express from "express";

// Import all error handler methods from errorHandler module
import { invalidRoute, invalidJSON } from "../utils/errorHandler";

// Import Router method
import route from "../routes/route";

// Initialize an Express application
const app = express();

// Handle existing routes after base URL
app.use(route);

// Middleware to handle invalid routes
app.use(invalidRoute);

// Middleware to handle invalid JSON structure
app.use(invalidJSON);

// Reset DB before test suite
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// Close the connection after test suite
afterAll(async () => {
  await sequelize.close();
});

describe("User API Endpoints", () => {
  // Test1
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
  // Test2
  it("should return error when creating a user with invalid id", async () => {
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
  // Test3
  it("should return error when creating a user with existing email", async () => {
    const response = await request(app).post("/users").send({
      userID: 2,
      userName: "Ez",
      email: "amr@gmail.com",
      password: "asdsad123455666",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid body request");
    expect(response.body).toHaveProperty(
      "message",
      "the email you are trying to use is already associated with another user"
    );
  });
});

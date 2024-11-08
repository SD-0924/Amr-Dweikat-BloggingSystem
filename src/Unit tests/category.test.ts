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

describe("Category API Endpoints", () => {
  // Test1
  it("should create a new category", async () => {
    await request(app).post("/users").send({
      userID: 1,
      userName: "Amr",
      email: "amr@gmail.com",
      password: "asdsad123455666",
    });

    const post = await request(app).post("/posts").send({
      userID: 1,
      title: "sucess",
      content: "hello",
    });

    const response = await request(app)
      .post(`/posts/${post.body.post.postID}/categories`)
      .send({
        name: "strong",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Category created successfully"
    );
    expect(response.body.category).toHaveProperty("name", "strong");
  });

  // Test2
  it("should return error when creating a category when post does not exist", async () => {
    const response = await request(app).post(`/posts/999/categories`).send({
      name: "weak",
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Post does not exists");
    expect(response.body).toHaveProperty(
      "message",
      "the post you're trying to work on does not exists"
    );
  });

  // Test3
  it("should return error when creating the same category for same post", async () => {
    const post = await request(app).get("/posts").send();

    const response = await request(app)
      .post(`/posts/${post.body[0].postID}/categories`)
      .send({
        name: "strong",
      });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error", "Category already assigned");
    expect(response.body).toHaveProperty(
      "message",
      "the category that you are trying to assign to the post is already assigned"
    );
  });

  // Test4
  it("should return all categories for a specific post", async () => {
    const post = await request(app).get("/posts").send();

    await request(app).post(`/posts/${post.body[0].postID}/categories`).send({
      name: "weak",
    });

    const response = await request(app).get(
      `/posts/${post.body[0].postID}/categories`
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("name", "strong");
    expect(response.body[1]).toHaveProperty("name", "weak");
  });

  // Test5
  it("should return error when getting all categories for post does not exist", async () => {
    const response = await request(app).get("/posts/999/categories");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Post does not exists");
    expect(response.body).toHaveProperty(
      "message",
      "the post you're trying to work on does not exists"
    );
  });
});

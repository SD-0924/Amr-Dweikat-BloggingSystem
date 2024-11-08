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

describe("Post API Endpoints", () => {
  // Test1
  it("should create a new post", async () => {
    const userResponse = await request(app).post("/users").send({
      userID: 1,
      userName: "Amr",
      email: "amr@gmail.com",
      password: "asdsad123455666",
    });

    const response = await request(app).post("/posts").send({
      userID: 1,
      title: "sucess",
      content: "hello",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Post created successfully"
    );
    expect(response.body.post).toHaveProperty("title", "sucess");
    expect(response.body.post).toHaveProperty("content", "hello");
    expect(response.body.post.user).toHaveProperty("userID", 1);
    expect(response.body.post.user).toHaveProperty("userName", "Amr");
    expect(response.body.post.user).toHaveProperty("email", "amr@gmail.com");
  });

  // Test2
  it("should return error when creating a post when user does not exist", async () => {
    const response = await request(app).post("/posts").send({
      userID: 999,
      title: "sucess",
      content: "hello",
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "User not found");
    expect(response.body).toHaveProperty(
      "message",
      "the user you are trying to associate with this post does not exists"
    );
  });

  // Test3
  it("should return all posts", async () => {
    const response = await request(app).get("/posts");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("title", "sucess");
    expect(response.body[0]).toHaveProperty("content", "hello");
    expect(response.body[0].user).toHaveProperty("userID", 1);
    expect(response.body[0].user).toHaveProperty("userName", "Amr");
    expect(response.body[0].user).toHaveProperty("email", "amr@gmail.com");
    expect(Array.isArray(response.body[0].categories)).toBe(true);
    expect(response.body[0].categories.length).toBe(0);
    expect(Array.isArray(response.body[0].comments)).toBe(true);
    expect(response.body[0].comments.length).toBe(0);
  });

  // // Test5
  // it("should return a specific user", async () => {
  //   const response = await request(app).get("/users/1");

  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty("userID", 1);
  //   expect(response.body).toHaveProperty("userName", "Amr");
  //   expect(response.body).toHaveProperty("email", "amr@gmail.com");
  // });

  // // Test6
  // it("should return error when getting a user that does not exist", async () => {
  //   const response = await request(app).get("/users/999");

  //   expect(response.status).toBe(404);
  //   expect(response.body).toHaveProperty("error", "User not found");
  //   expect(response.body).toHaveProperty(
  //     "message",
  //     "the user you are trying to fetch doest not exists"
  //   );
  // });

  // // Test7
  // it("should update the user information", async () => {
  //   const response = await request(app).put("/users/1").send({
  //     userName: "Ahmad",
  //     email: "ahmad@gmail.com",
  //     password: "ahmad1234!@#$",
  //   });

  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty(
  //     "message",
  //     "User updated successfully"
  //   );
  //   expect(response.body.user).toHaveProperty("userID", 1);
  //   expect(response.body.user).toHaveProperty("userName", "Ahmad");
  //   expect(response.body.user).toHaveProperty("email", "ahmad@gmail.com");
  // });

  // // Test8
  // it("should return error when updating a user that does not exist", async () => {
  //   const response = await request(app).put("/users/999").send({
  //     userName: "Ahmad",
  //     email: "ahmad@gmail.com",
  //     password: "ahmad1234!@#$",
  //   });

  //   expect(response.status).toBe(404);
  //   expect(response.body).toHaveProperty("error", "User not found");
  //   expect(response.body).toHaveProperty(
  //     "message",
  //     "the user that you are trying to update their information does not exists"
  //   );
  // });

  // // Test9
  // it("should delete the user", async () => {
  //   const response = await request(app).delete("/users/1");

  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty(
  //     "message",
  //     "User deleted successfully"
  //   );
  // });

  // // Test10
  // it("should return error when deleteing a user that does not exist", async () => {
  //   const response = await request(app).delete("/users/999");

  //   expect(response.status).toBe(404);
  //   expect(response.body).toHaveProperty("error", "User not found");
  //   expect(response.body).toHaveProperty(
  //     "message",
  //     "the user you are trying to delete already not exists"
  //   );
  // });
});

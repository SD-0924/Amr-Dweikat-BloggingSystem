// import supertest module to test express routes
import request from "supertest";

// import database configuration and models from model module
import { sequelize } from "../config/db";

// Import express module
import express from "express";

// Import Router method
import { postRoutes } from "../routes/postRoutes";
import { userRoutes } from "../routes/userRoutes";

import jwt from "jsonwebtoken";

import { defineAssociations } from "../models/associations";

// Initialize an Express application
const app = express();

// Handle existing routes after base URL
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

// Reset DB before test suite
beforeAll(async () => {
  defineAssociations();
  await sequelize.sync({ force: true });
});

// Close the connection after test suite
afterAll(async () => {
  await sequelize.close();
});

describe("Category API Endpoints", () => {
  // Test1
  it("should create a new category", async () => {
    const userInfo = await request(app).post("/users").send({
      userName: "Amr",
      email: "amr@gmail.com",
      password: "Amr12341234",
    });

    expect(userInfo.status).toBe(201);

    const tokenInfor = await request(app).post("/users/login").send({
      email: "amr@gmail.com",
      password: "Amr12341234",
    });

    expect(tokenInfor.status).toBe(200);

    const postInfo = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${tokenInfor.body.token}`)
      .send({
        userId: userInfo.body.user.id,
        title: "sucess",
        content: "hello",
      });

    expect(postInfo.status).toBe(201);

    const response = await request(app)
      .post(`/posts/${postInfo.body.post.id}/categories`)
      .set("Authorization", `Bearer ${tokenInfor.body.token}`)
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
    const tokenInfor = await request(app).post("/users/login").send({
      email: "amr@gmail.com",
      password: "Amr12341234",
    });

    expect(tokenInfor.status).toBe(200);

    const response = await request(app)
      .post(`/posts/999/categories`)
      .set("Authorization", `Bearer ${tokenInfor.body.token}`)
      .send({
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
    const tokenInfor = await request(app).post("/users/login").send({
      email: "amr@gmail.com",
      password: "Amr12341234",
    });

    expect(tokenInfor.status).toBe(200);

    const post = await request(app).get("/posts").send();

    const response = await request(app)
      .post(`/posts/${post.body[0].id}/categories`)
      .set("Authorization", `Bearer ${tokenInfor.body.token}`)
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
    const postInfo = await request(app).get("/posts").send();

    expect(postInfo.status).toBe(200);

    const tokenInfor = await request(app).post("/users/login").send({
      email: "amr@gmail.com",
      password: "Amr12341234",
    });

    expect(tokenInfor.status).toBe(200);

    const categoryInfo = await request(app)
      .post(`/posts/${postInfo.body[0].id}/categories`)
      .set("Authorization", `Bearer ${tokenInfor.body.token}`)
      .send({
        name: "weak",
      });

    expect(categoryInfo.status).toBe(201);

    const response = await request(app)
      .get(`/posts/${postInfo.body[0].id}/categories`)
      .set("Authorization", `Bearer ${tokenInfor.body.token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("name", "strong");
    expect(response.body[1]).toHaveProperty("name", "weak");
  });

  // Test5
  it("should return error when getting all categories for post does not exist", async () => {
    const tokenInfor = await request(app).post("/users/login").send({
      email: "amr@gmail.com",
      password: "Amr12341234",
    });

    expect(tokenInfor.status).toBe(200);

    const response = await request(app)
      .get("/posts/999/categories")
      .set("Authorization", `Bearer ${tokenInfor.body.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Post does not exists");
    expect(response.body).toHaveProperty(
      "message",
      "the post you're trying to work on does not exists"
    );
  });
});

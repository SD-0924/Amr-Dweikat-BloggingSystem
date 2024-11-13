// import supertest module to test express routes
import request from "supertest";

// import database configuration and models from model module
import { sequelize } from "../config/db";

// Import express module
import express from "express";

// Import Router method
import { postRoutes } from "../routes/postRoutes";
import { userRoutes } from "../routes/userRoutes";

import { defineAssociations } from "../models/associations";

import jwt from "jsonwebtoken";

// Initialize an Express application
const app = express();

// Handle existing routes after base URL
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

// Reset DB before test suite
beforeAll(async () => {
  try {
    defineAssociations();
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
});
// Close the connection after test suite
afterAll(async () => {
  await sequelize.close();
});

// Helper function to generate a valid token
function generateToken(payload: string | object | Buffer, expiresIn = "1h") {
  return jwt.sign(payload, "my-secret-key", { expiresIn });
}

describe("Post API Endpoints", () => {
  // Generate a valid token
  const validToken = generateToken({
    email: "amr@gmail.com",
    password: "Amr12341234",
  });

  // Test1
  it("should create a new post", async () => {
    const userResponse = await request(app).post("/users").send({
      userName: "Amr",
      email: "amr@gmail.com",
      password: "Amr12341234",
    });

    expect(userResponse.status).toBe(201);

    const response = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        userId: userResponse.body.user.id,
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
    expect(response.body.post.user).toHaveProperty(
      "id",
      userResponse.body.user.id
    );
    expect(response.body.post.user).toHaveProperty("userName", "Amr");
    expect(response.body.post.user).toHaveProperty("email", "amr@gmail.com");
  });

  // Test2
  it("should return error when creating a post when user does not exist", async () => {
    const response = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        userId: 999,
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
    expect(response.body[0].user).toHaveProperty("userName", "Amr");
    expect(response.body[0].user).toHaveProperty("email", "amr@gmail.com");
    expect(Array.isArray(response.body[0].categories)).toBe(true);
    expect(response.body[0].categories.length).toBe(0);
    expect(Array.isArray(response.body[0].comments)).toBe(true);
    expect(response.body[0].comments.length).toBe(0);
  });

  // Test4
  it("should return a specific post", async () => {
    const posts = await request(app).get("/posts");

    expect(posts.status).toBe(200);

    const response = await request(app)
      .get(`/posts/${posts.body[0].id}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "sucess");
    expect(response.body).toHaveProperty("content", "hello");
    expect(response.body.user).toHaveProperty("userName", "Amr");
    expect(response.body.user).toHaveProperty("email", "amr@gmail.com");
    expect(Array.isArray(response.body.categories)).toBe(true);
    expect(response.body.categories.length).toBe(0);
    expect(Array.isArray(response.body.comments)).toBe(true);
    expect(response.body.comments.length).toBe(0);
  });

  // Test5
  it("should delete the post", async () => {
    const posts = await request(app).get("/posts");

    expect(posts.status).toBe(200);

    const response = await request(app)
      .delete(`/posts/${posts.body[0].id}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Post deleted successfully"
    );
  });

  // Test6
  it("should return error when deleteing a post that does not exist", async () => {
    const response = await request(app)
      .delete("/posts/999")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Post not found");
    expect(response.body).toHaveProperty(
      "message",
      "the post you are trying to delete already not exists"
    );
  });

  // Test7
  it("should return error when getting a post that does not exist", async () => {
    const response = await request(app)
      .get("/posts/999")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Post not found");
    expect(response.body).toHaveProperty(
      "message",
      "the post you are trying to fetch doest not exists"
    );
  });

  // Test8
  it("should return error when updating a post that does not exist", async () => {
    const response = await request(app)
      .put(`/posts/999`)
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        title: "fail",
        content: "nooooooooo",
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Post not found");
    expect(response.body).toHaveProperty(
      "message",
      "the post that you are trying to update their information does not exists"
    );
  });

  // Test9
  it("should update the post information", async () => {
    const userInfo = await request(app).get("/users").send();

    expect(userInfo.status).toBe(200);

    const postInfo = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        userId: userInfo.body[0].id,
        title: "sucess",
        content: "hello",
      });

    expect(postInfo.status).toBe(201);

    const response = await request(app)
      .put(`/posts/${postInfo.body.post.id}`)
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        title: "fail",
        content: "nooooooooo",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Post updated successfully"
    );
    expect(response.body.post).toHaveProperty("title", "fail");
    expect(response.body.post).toHaveProperty("content", "nooooooooo");
    expect(response.body.post.user).toHaveProperty("id", userInfo.body[0].id);
    expect(response.body.post.user).toHaveProperty("userName", "Amr");
    expect(response.body.post.user).toHaveProperty("email", "amr@gmail.com");
  });
});

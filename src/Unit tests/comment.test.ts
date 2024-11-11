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

// Initialize an Express application
const app = express();

// Handle existing routes after base URL
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

// Reset DB before test suite
beforeAll(async () => {
  try {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
    await sequelize.sync({ force: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
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

describe("Comment API Endpoints", () => {
  // Generate a valid token
  const validToken = generateToken({
    email: "amr@gmail.com",
    password: "Amr12341234",
  });

  // Test1
  it("should create a new comment", async () => {
    const userInfo = await request(app).post("/users").send({
      userName: "Amr",
      email: "amr@gmail.com",
      password: "Amr12341234",
    });

    expect(userInfo.status).toBe(201);

    const postInfo = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        userId: userInfo.body.user.id,
        title: "sucess",
        content: "hello",
      });

    expect(postInfo.status).toBe(201);

    const response = await request(app)
      .post(`/posts/${postInfo.body.post.id}/comments`)
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        content: "this is my first comment",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Comment created successfully"
    );
    expect(response.body.comment).toHaveProperty(
      "content",
      "this is my first comment"
    );
  });

  // Test2
  it("should return error when creating a comment when post does not exist", async () => {
    const response = await request(app)
      .post(`/posts/999/comments`)
      .set("Authorization", `Bearer ${validToken}`)
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
  it("should return all comments for a specific post", async () => {
    const posts = await request(app).get("/posts").send();

    expect(posts.status).toBe(200);

    await request(app)
      .post(`/posts/${posts.body[0].id}/comments`)
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        content: "weak",
      });

    const response = await request(app)
      .get(`/posts/${posts.body[0].id}/comments`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty(
      "content",
      "this is my first comment"
    );
    expect(response.body[1]).toHaveProperty("content", "weak");
  });

  // Test5
  it("should return error when getting all comments for post does not exist", async () => {
    const response = await request(app)
      .get("/posts/999/comments")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Post does not exists");
    expect(response.body).toHaveProperty(
      "message",
      "the post you're trying to work on does not exists"
    );
  });
});

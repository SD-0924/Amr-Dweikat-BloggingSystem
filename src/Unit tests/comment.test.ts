// import supertest module to test express routes
import request from "supertest";

// import database configuration and models from model module
import { sequelize } from "../config/db";

// Import express module
import express from "express";

// Import models
import { User } from "../models/userModel";
import { Post } from "../models/postModel";
import { Comment } from "../models/commentModel";

// Import Router method
import { postRoutes } from "../routes/postRoutes";
import { userRoutes } from "../routes/userRoutes";

// Initialize an Express application
const app = express();

// Handle existing routes after base URL
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

// Reset DB before test suite
beforeAll(async () => {
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
  await User.destroy({ where: {} });
  await Post.destroy({ where: {} });
  await Comment.destroy({ where: {} });
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
});

// Close the connection after test suite
afterAll(async () => {
  await sequelize.close();
});

describe("Comment API Endpoints", () => {
  // Test1
  it("should create a new comment", async () => {
    const userInfo = await request(app).post("/users").send({
      userName: "Amr",
      email: "amr@gmail.com",
      password: "asdsad123455666",
    });

    expect(userInfo.status).toBe(201);

    const postInfo = await request(app).post("/posts").send({
      userId: userInfo.body.user.id,
      title: "sucess",
      content: "hello",
    });

    expect(postInfo.status).toBe(201);

    const response = await request(app)
      .post(`/posts/${postInfo.body.post.id}/comments`)
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
    const response = await request(app).post(`/posts/999/comments`).send({
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

    await request(app).post(`/posts/${posts.body[0].id}/comments`).send({
      content: "weak",
    });

    const response = await request(app).get(
      `/posts/${posts.body[0].id}/comments`
    );

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
    const response = await request(app).get("/posts/999/comments");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Post does not exists");
    expect(response.body).toHaveProperty(
      "message",
      "the post you're trying to work on does not exists"
    );
  });
});

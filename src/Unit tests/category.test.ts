// import supertest module to test express routes
import request from "supertest";

// import database configuration and models from model module
import { sequelize } from "../config/db";

// Import express module
import express from "express";

// Import models
import { User } from "../models/userModel";
import { Post } from "../models/postModel";
import { Category } from "../models/categoryModel";
import { PostCategory } from "../models/postCategoryModel";

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
  await User.destroy({ where: {} });
  await Post.destroy({ where: {} });
  await Category.destroy({ where: {} });
  await PostCategory.destroy({ where: {} });
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
      .post(`/posts/${postInfo.body.post.id}/categories`)
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
      .post(`/posts/${post.body[0].id}/categories`)
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

    const categoryInfo = await request(app)
      .post(`/posts/${postInfo.body[0].id}/categories`)
      .send({
        name: "weak",
      });

    expect(categoryInfo.status).toBe(201);

    const response = await request(app).get(
      `/posts/${postInfo.body[0].id}/categories`
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

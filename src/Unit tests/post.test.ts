// import supertest module to test express routes
import request from "supertest";

// Import express module
import express from "express";

// Import Router method
import { postRoutes } from "../routes/postRoutes";
import { userRoutes } from "../routes/userRoutes";

// Import models
import { User } from "../models/userModel";
import { userJWTService } from "../services/userJWTService";
import { UserJWT } from "../models/userJWTModel";
import { Post } from "../models/postModel";
import { PostCategory } from "../models/postCategoryModel";
import { Comment } from "../models/commentModel";

// Mocking the entire models
jest.mock("../models/userModel");
jest.mock("../models/userJWTModel");
jest.mock("../models/postModel");
jest.mock("../models/postCategoryModel");
jest.mock("../models/commentModel");

// Initialize an Express application
const app = express();

// Handle existing routes after base URL
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

describe("Post API Endpoints", () => {
  // Test1
  it("should create a new post", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (User.findByPk as jest.Mock).mockResolvedValue({
      id: 1,
      userName: "Amr",
      email: "amr@gmail.com",
      password: "hashed_password_here",
      dataValues: {
        id: 1,
        userName: "Amr",
        email: "amr@gmail.com",
        password: "hashed_password_here",
      },
    });

    const mockPost = {
      id: 1,
      userId: 1,
      title: "sucess",
      content: "hello",
      dataValues: {
        id: 1,
        userId: 1,
        title: "sucess",
        content: "hello",
      },
    };
    (Post.create as jest.Mock).mockResolvedValue(mockPost);

    const response = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${mockToken.token}`)
      .send({
        userId: 1,
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
    expect(response.body.post.user).toHaveProperty("id", 1);
    expect(response.body.post.user).toHaveProperty("userName", "Amr");
    expect(response.body.post.user).toHaveProperty("email", "amr@gmail.com");
  });

  // Test2
  it("should return error when creating a post when user does not exist", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (User.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${mockToken.token}`)
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
    (Post.findAll as jest.Mock).mockResolvedValue([
      {
        dataValues: {
          id: 1,
          userId: 1,
          title: "sucess",
          content: "hello",
        },
      },
    ]);

    (User.findByPk as jest.Mock).mockResolvedValue({
      dataValues: {
        id: 1,
        userName: "Amr",
        email: "amr@gmail.com",
        password: "hashed_password_here",
      },
    });

    (PostCategory.findAll as jest.Mock).mockResolvedValue([]);
    (Comment.findAll as jest.Mock).mockResolvedValue([]);

    const response = await request(app).get("/posts");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].dataValues).toHaveProperty("title", "sucess");
    expect(response.body[0].dataValues).toHaveProperty("content", "hello");
    expect(response.body[0].dataValues.user).toHaveProperty("userName", "Amr");
    expect(response.body[0].dataValues.user).toHaveProperty(
      "email",
      "amr@gmail.com"
    );
    expect(Array.isArray(response.body[0].dataValues.categories)).toBe(true);
    expect(response.body[0].dataValues.categories.length).toBe(0);
    expect(Array.isArray(response.body[0].dataValues.comments)).toBe(true);
    expect(response.body[0].dataValues.comments.length).toBe(0);
  });

  // Test4
  it("should return a specific post", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (Post.findByPk as jest.Mock).mockResolvedValue({
      dataValues: {
        id: 1,
        userId: 1,
        title: "sucess",
        content: "hello",
      },
    });

    (User.findByPk as jest.Mock).mockResolvedValue({
      dataValues: {
        id: 1,
        userName: "Amr",
        email: "amr@gmail.com",
        password: "hashed_password_here",
      },
    });

    (PostCategory.findAll as jest.Mock).mockResolvedValue([]);
    (Comment.findAll as jest.Mock).mockResolvedValue([]);

    const response = await request(app)
      .get(`/posts/1`)
      .set("Authorization", `Bearer ${mockToken.token}`);

    expect(response.status).toBe(200);
    expect(response.body.dataValues).toHaveProperty("title", "sucess");
    expect(response.body.dataValues).toHaveProperty("content", "hello");
    expect(response.body.dataValues.user.dataValues).toHaveProperty(
      "userName",
      "Amr"
    );
    expect(response.body.dataValues.user.dataValues).toHaveProperty(
      "email",
      "amr@gmail.com"
    );
    expect(Array.isArray(response.body.dataValues.categories)).toBe(true);
    expect(response.body.dataValues.categories.length).toBe(0);
    expect(Array.isArray(response.body.dataValues.comments)).toBe(true);
    expect(response.body.dataValues.comments.length).toBe(0);
  });

  // Test5
  it("should delete the post", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (Post.destroy as jest.Mock).mockResolvedValue(1);

    const response = await request(app)
      .delete(`/posts/1`)
      .set("Authorization", `Bearer ${mockToken.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Post deleted successfully"
    );
  });

  // Test6
  it("should return error when deleteing a post that does not exist", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (Post.destroy as jest.Mock).mockResolvedValue(0);

    const response = await request(app)
      .delete("/posts/999")
      .set("Authorization", `Bearer ${mockToken.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Post not found");
    expect(response.body).toHaveProperty(
      "message",
      "the post you are trying to delete already not exists"
    );
  });

  // Test7
  it("should return error when getting a post that does not exist", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (Post.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .get("/posts/999")
      .set("Authorization", `Bearer ${mockToken.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Post not found");
    expect(response.body).toHaveProperty(
      "message",
      "the post you are trying to fetch doest not exists"
    );
  });

  // Test8
  it("should return error when updating a post that does not exist", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (Post.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .put(`/posts/999`)
      .set("Authorization", `Bearer ${mockToken.token}`)
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
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (Post.findByPk as jest.Mock).mockResolvedValue({
      dataValues: {
        id: 1,
        userId: 1,
        title: "fail",
        content: "nooooooooo",
      },
    });

    (User.findByPk as jest.Mock).mockResolvedValue({
      dataValues: {
        id: 1,
        userName: "Amr",
        email: "amr@gmail.com",
        password: "hashed_password_here",
      },
    });

    (PostCategory.findAll as jest.Mock).mockResolvedValue([]);
    (Comment.findAll as jest.Mock).mockResolvedValue([]);

    const response = await request(app)
      .put(`/posts/1`)
      .set("Authorization", `Bearer ${mockToken.token}`)
      .send({
        title: "fail",
        content: "nooooooooo",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Post updated successfully"
    );
    expect(response.body.post.dataValues).toHaveProperty("title", "fail");
    expect(response.body.post.dataValues).toHaveProperty(
      "content",
      "nooooooooo"
    );
    expect(response.body.post.dataValues.user.dataValues).toHaveProperty(
      "userName",
      "Amr"
    );
    expect(response.body.post.dataValues.user.dataValues).toHaveProperty(
      "email",
      "amr@gmail.com"
    );
    expect(Array.isArray(response.body.post.dataValues.categories)).toBe(true);
    expect(response.body.post.dataValues.categories.length).toBe(0);
    expect(Array.isArray(response.body.post.dataValues.comments)).toBe(true);
    expect(response.body.post.dataValues.comments.length).toBe(0);
  });
});

// import supertest module to test express routes
import request from "supertest";

// Import express module
import express from "express";

// Import Router method
import { postRoutes } from "../routes/postRoutes";
import { userRoutes } from "../routes/userRoutes";

// Initialize an Express application
const app = express();

// Handle existing routes after base URL
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

// Import models
import { userJWTService } from "../services/userJWTService";
import { UserJWT } from "../models/userJWTModel";
import { Post } from "../models/postModel";
import { Comment } from "../models/commentModel";

// Mocking the entire models
jest.mock("../models/userJWTModel");
jest.mock("../models/postModel");
jest.mock("../models/commentModel");

describe("Comment API Endpoints", () => {
  // Test1
  it("should create a new comment", async () => {
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

    (Comment.create as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 1,
      postId: 1,
      content: "this is my first comment",
    });

    const response = await request(app)
      .post(`/posts/1/comments`)
      .set("Authorization", `Bearer ${mockToken.token}`)
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
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (Post.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post(`/posts/999/comments`)
      .set("Authorization", `Bearer ${mockToken.token}`)
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

    (Comment.findAll as jest.Mock).mockResolvedValue([
      {
        id: 1,
        userId: 1,
        postId: 1,
        content: "this is my first comment",
      },
      {
        id: 2,
        userId: 1,
        postId: 1,
        content: "weak",
      },
    ]);

    const response = await request(app)
      .get(`/posts/1/comments`)
      .set("Authorization", `Bearer ${mockToken.token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty(
      "content",
      "this is my first comment"
    );
    expect(response.body[1]).toHaveProperty("content", "weak");
  });

  // Test4
  it("should return error when getting all comments for post does not exist", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (Post.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .get("/posts/999/comments")
      .set("Authorization", `Bearer ${mockToken.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Post does not exists");
    expect(response.body).toHaveProperty(
      "message",
      "the post you're trying to work on does not exists"
    );
  });
});

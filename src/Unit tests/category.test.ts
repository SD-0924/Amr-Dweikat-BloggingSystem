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
import { PostCategory } from "../models/postCategoryModel";
import { Category } from "../models/categoryModel";

// Mocking the entire models
jest.mock("../models/userJWTModel");
jest.mock("../models/postModel");
jest.mock("../models/postCategoryModel");
jest.mock("../models/categoryModel");

describe("Category API Endpoints", () => {
  // Test1
  it("should create a new category", async () => {
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

    (Category.findOne as jest.Mock).mockResolvedValue(null);
    (Category.create as jest.Mock).mockResolvedValue({
      dataValues: { name: "strong", id: 1 },
    });

    (PostCategory.create as jest.Mock).mockResolvedValue({
      postId: 1,
      categoryId: 1,
    });

    const response = await request(app)
      .post(`/posts/1/categories`)
      .set("Authorization", `Bearer ${mockToken.token}`)
      .send({
        name: "strong",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Category created successfully"
    );
    expect(response.body.category.dataValues).toHaveProperty("name", "strong");
  });

  // Test2
  it("should return error when creating a category when post does not exist", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (Post.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post(`/posts/999/categories`)
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
  it("should return error when creating the same category for same post", async () => {
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

    (Category.findOne as jest.Mock).mockResolvedValue({
      dataValues: { name: "strong", id: 1 },
    });

    (PostCategory.findOne as jest.Mock).mockResolvedValue({
      postId: 1,
      categoryId: 1,
    });

    const response = await request(app)
      .post(`/posts/1/categories`)
      .set("Authorization", `Bearer ${mockToken.token}`)
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

    (PostCategory.findAll as jest.Mock).mockResolvedValue([
      {
        dataValues: {
          postId: 1,
          categoryId: 1,
        },
      },
    ]);

    (Category.findByPk as jest.Mock).mockResolvedValue({
      dataValues: { name: "strong", id: 1 },
    });

    const response = await request(app)
      .get(`/posts/1/categories`)
      .set("Authorization", `Bearer ${mockToken.token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].dataValues).toHaveProperty("name", "strong");
  });

  // Test5
  it("should return error when getting all categories for post does not exist", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (Post.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .get("/posts/999/categories")
      .set("Authorization", `Bearer ${mockToken.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Post does not exists");
    expect(response.body).toHaveProperty(
      "message",
      "the post you're trying to work on does not exists"
    );
  });
});

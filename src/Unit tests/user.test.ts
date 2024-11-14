// import supertest module to test express routes
import request from "supertest";

// Import express module
import express from "express";

// Import Router method
import { userRoutes } from "../routes/userRoutes";

// Import models
import { User } from "../models/userModel";
import { userJWTService } from "../services/userJWTService";
import { UserJWT } from "../models/userJWTModel";

// Mocking the entire models
jest.mock("../models/userModel");
jest.mock("../models/userJWTModel");

// Initialize an Express application
const app = express();

// Handle existing routes after base URL
app.use("/users", userRoutes);

describe("User API Endpoints", () => {
  // Test1
  it("should create a new user", async () => {
    const mockUser = {
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
    };
    (User.create as jest.Mock).mockResolvedValue(mockUser);
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const response = await request(app).post("/users").send({
      userName: "Amr",
      email: "amr@gmail.com",
      password: "Ez12341234",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "User created successfully"
    );
    expect(response.body.user).toHaveProperty("userName", "Amr");
    expect(response.body.user).toHaveProperty("email", "amr@gmail.com");
  });

  // Test2
  it("should return error when creating a user with invalid name", async () => {
    const response = await request(app).post("/users").send({
      userName: 1,
      email: "amr@gmail.com",
      password: "asdsad123455666",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid body request");
    expect(response.body).toHaveProperty(
      "message",
      "'userName' must be a string"
    );
  });

  // // Test3
  it("should return error when creating a user with existing email", async () => {
    const mockUser = {
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
    };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).post("/users").send({
      userName: "Ez",
      email: "amr@gmail.com",
      password: "asdsad123455666",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid body request");
    expect(response.body).toHaveProperty(
      "message",
      "the email you are trying to use is already associated with another user"
    );
  });

  // Test4
  it("should return all users", async () => {
    const mockUser = [
      {
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
      },
    ];
    (User.findAll as jest.Mock).mockResolvedValue(mockUser);
    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("userName", "Amr");
    expect(response.body[0]).toHaveProperty("email", "amr@gmail.com");
  });

  // Test5
  it("should return a specific user", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    const mockUser = {
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
    };
    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .get(`/users/1`)
      .set("Authorization", `Bearer ${mockToken.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("userName", "Amr");
    expect(response.body).toHaveProperty("email", "amr@gmail.com");
  });

  // Test6
  it("should return error when getting a user that does not exist", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (User.findByPk as jest.Mock).mockResolvedValue(null);
    const response = await request(app)
      .get("/users/999")
      .set("Authorization", `Bearer ${mockToken.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "User not found");
    expect(response.body).toHaveProperty(
      "message",
      "the user you are trying to fetch doest not exists"
    );
  });

  // Test7
  it("should update the user information", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    const mockUser = {
      id: 1,
      userName: "Ahmad",
      email: "ahmad@gmail.com",
      password: "hashed_password_here",
      dataValues: {
        id: 1,
        userName: "Ahmad",
        email: "ahmad@gmail.com",
        password: "hashed_password_here",
      },
    };
    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .put(`/users/1`)
      .set("Authorization", `Bearer ${mockToken.token}`)
      .send({
        userName: "Ahmad",
        email: "ahmad@gmail.com",
        password: "ahmad1234!@#$",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "User updated successfully"
    );
    expect(response.body.user).toHaveProperty("id", 1);
    expect(response.body.user).toHaveProperty("userName", "Ahmad");
    expect(response.body.user).toHaveProperty("email", "ahmad@gmail.com");
  });

  // Test8
  it("should return error when updating a user that does not exist", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (User.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .put("/users/999")
      .set("Authorization", `Bearer ${mockToken.token}`)
      .send({
        userName: "Ahmad",
        email: "ahmad@gmail.com",
        password: "ahmad1234!@#$",
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "User not found");
    expect(response.body).toHaveProperty(
      "message",
      "the user that you are trying to update their information does not exists"
    );
  });

  // Test9
  it("should delete the user", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (User.destroy as jest.Mock).mockResolvedValue(1);

    const response = await request(app)
      .delete(`/users/1`)
      .set("Authorization", `Bearer ${mockToken.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "User deleted successfully"
    );
  });

  // Test10
  it("should return error when deleting a user that does not exist", async () => {
    const mockToken = {
      userId: 1,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbXJAZ21haWwuY29tIiwiaWF0IjoxNzMxNTgyODg3LCJleHAiOjE3MzE1ODM3ODd9.l9PBEk-F-N3fOZRNfNQTP3E2X5IMYU86HBSFsxqQBOY",
    };
    (UserJWT.findOne as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(userJWTService, "isTokenExpired").mockReturnValue(false);

    (User.destroy as jest.Mock).mockResolvedValue(0);

    const response = await request(app)
      .delete(`/users/1`)
      .set("Authorization", `Bearer ${mockToken.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "User not found");
    expect(response.body).toHaveProperty(
      "message",
      "the user you are trying to delete already not exists"
    );
  });
});

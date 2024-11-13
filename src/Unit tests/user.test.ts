// import supertest module to test express routes
import request from "supertest";

// import database configuration
import { sequelize } from "../config/db";

// Import express module
import express from "express";

// Import Router method
import { userRoutes } from "../routes/userRoutes";

// Initialize an Express application
const app = express();

// Handle existing routes after base URL
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

describe("User API Endpoints", () => {
  // Test1
  it("should create a new user", async () => {
    const response = await request(app).post("/users").send({
      userName: "Amr",
      email: "amr@gmail.com",
      password: "Amr12341234",
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

  // Test3
  it("should return error when creating a user with existing email", async () => {
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
    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("userName", "Amr");
    expect(response.body[0]).toHaveProperty("email", "amr@gmail.com");
  });

  // Test5
  it("should return a specific user", async () => {
    const users = await request(app).get("/users");

    expect(users.status).toBe(200);

    const tokenInfor = await request(app).post("/users/login").send({
      email: "amr@gmail.com",
      password: "Amr12341234",
    });

    expect(tokenInfor).toBe(200);

    const response = await request(app)
      .get(`/users/${users.body[0].id}`)
      .set("Authorization", `Bearer ${tokenInfor.body.token}`);
    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", users.body[0].id);
    expect(response.body).toHaveProperty("userName", "Amr");
    expect(response.body).toHaveProperty("email", "amr@gmail.com");
  });

  // Test6
  it("should return error when getting a user that does not exist", async () => {
    const tokenInfor = await request(app).post("/users/login").send({
      email: "amr@gmail.com",
      password: "Amr12341234",
    });

    expect(tokenInfor).toBe(200);

    const response = await request(app)
      .get("/users/999")
      .set("Authorization", `Bearer ${tokenInfor.body.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "User not found");
    expect(response.body).toHaveProperty(
      "message",
      "the user you are trying to fetch doest not exists"
    );
  });

  // Test7
  it("should update the user information", async () => {
    const users = await request(app).get("/users");

    expect(users.status).toBe(200);

    const tokenInfor = await request(app).post("/users/login").send({
      email: "amr@gmail.com",
      password: "Amr12341234",
    });

    expect(tokenInfor).toBe(200);

    const response = await request(app)
      .put(`/users/${users.body[0].id}`)
      .set("Authorization", `Bearer ${tokenInfor.body.token}`)
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
    expect(response.body.user).toHaveProperty("id", users.body[0].id);
    expect(response.body.user).toHaveProperty("userName", "Ahmad");
    expect(response.body.user).toHaveProperty("email", "ahmad@gmail.com");
  });

  // Test8
  it("should return error when updating a user that does not exist", async () => {
    const tokenInfor = await request(app).post("/users/login").send({
      email: "ahmad@gmail.com",
      password: "ahmad1234!@#$",
    });

    expect(tokenInfor).toBe(200);

    const response = await request(app)
      .put("/users/999")
      .set("Authorization", `Bearer ${tokenInfor.body.token}`)
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
    const users = await request(app).get("/users");

    expect(users.status).toBe(200);

    const tokenInfor = await request(app).post("/users/login").send({
      email: "ahmad@gmail.com",
      password: "ahmad1234!@#$",
    });

    expect(tokenInfor).toBe(200);

    const response = await request(app)
      .delete(`/users/${users.body[0].id}`)
      .set("Authorization", `Bearer ${tokenInfor}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "User deleted successfully"
    );
  });
});

import express from "express";
import * as userController from "../controllers/userController";
import { authenticateJWT } from "../middleware/authMiddleware";

export const userRoutes = express.Router();

// Route for login user
userRoutes.post("/login", express.json(), userController.loginUser);

// Route for create user
userRoutes.post("/", express.json(), userController.createUser);

// Route for get all users
userRoutes.get("/", userController.getALLUsers);

// Route for get a specific user
userRoutes.get("/:userId", authenticateJWT, userController.getUser);

// Route for update a specific user
userRoutes.put(
  "/:userId",
  authenticateJWT,
  express.json(),
  userController.updateUser
);

// Route for delete a specific user
userRoutes.delete("/:userId", authenticateJWT, userController.deleteUser);

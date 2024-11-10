import express from "express";
import * as userController from "../controllers/userController";

export const userRoutes = express.Router();

// Route for create user
userRoutes.post("/", express.json(), userController.createUser);

// Route for get all users
userRoutes.get("/", userController.getALLUsers);

// Route for get a specific user
userRoutes.get("/:userId", userController.getUser);

// Route for update a specific user
userRoutes.put("/:userId", express.json(), userController.updateUser);

// Route for delete a specific user
userRoutes.delete("/:userId", userController.deleteUser);

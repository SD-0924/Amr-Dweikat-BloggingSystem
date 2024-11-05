// Import all methods inside controllers module
import * as controller from "../controllers/controller";

import express, { Router } from "express";

const router = Router();

// Route for create user
router.post("/users", express.json(), controller.createUser);

// Route for get all users
router.get("/users", controller.getALLUsers);

// Route for get a specific user
router.get("/users/:userId", controller.getUser);

// Route for update a specific user
router.put("/users/:userId", express.json(), controller.updateUser);

// Route for delete a specific user
router.delete("/users/:userId", controller.deleteUser);

export default router;

// Import all methods inside controllers module
import * as controller from "../controllers/controller";

import express, { Router } from "express";

const router = Router();

// Route for create user
router.post("/users", express.json(), controller.createUser);

// Route for get all users
router.get("/users", controller.getALLUsers);

// Route for get a specific users
router.get("/users/:userId", controller.getUser);

// Route for update a specific users
router.put("/users/:userId", express.json(), controller.updateUser);

export default router;

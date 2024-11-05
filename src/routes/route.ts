// Import all methods inside controllers module
import * as controller from "../controllers/controller";

import express, { Router } from "express";

const router = Router();

// Route for create user
router.post("/users", express.json(), controller.createUser);

// Route for get all users
router.get("/users", controller.getALLUsers);

export default router;

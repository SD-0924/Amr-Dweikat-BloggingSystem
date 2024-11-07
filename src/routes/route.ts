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

// Route for create post
router.post("/posts", express.json(), controller.createPost);

// Route for get all posts
router.get("/posts", controller.getALLPosts);

// Route for get a specific post
router.get("/posts/:postId", controller.getPost);

// Route for update a specific post
router.put("/posts/:postId", express.json(), controller.updatePost);

// Route for delete a specific post
router.delete("/posts/:postId", controller.deletePost);

// Route for create category for a specific post
router.post(
  "/posts/:postId/categories",
  express.json(),
  controller.createCategory
);

// Route for get all categories realted to specific post
router.get("/posts/:postId/categories", controller.getCategories);

// Route for create comment for a specific post
router.post(
  "/posts/:postId/comments",
  express.json(),
  controller.createComment
);

// Route for get all comments realted to specific post
router.get("/posts/:postId/comments", controller.getComments);

export default router;

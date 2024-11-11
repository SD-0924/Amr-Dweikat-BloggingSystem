import express from "express";
import * as postController from "../controllers/postController";
import * as categoryController from "../controllers/categoryController";
import * as commentController from "../controllers/commentController";

import { authenticateJWT } from "../middleware/authMiddleware";

export const postRoutes = express.Router();

// Route for create post
postRoutes.post(
  "/",
  authenticateJWT,
  express.json(),
  postController.createPost
);

// Route for get all posts
postRoutes.get("/", postController.getALLPosts);

// Route for get a specific post
postRoutes.get("/:postId", authenticateJWT, postController.getPost);

// Route for update a specific post
postRoutes.put(
  "/:postId",
  authenticateJWT,
  express.json(),
  postController.updatePost
);

// Route for delete a specific post
postRoutes.delete("/:postId", authenticateJWT, postController.deletePost);

// Route for create category for a specific post
postRoutes.post(
  "/:postId/categories",
  authenticateJWT,
  express.json(),
  categoryController.createCategory
);

// Route for get all categories realted to specific post
postRoutes.get(
  "/:postId/categories",
  authenticateJWT,
  categoryController.getCategories
);

// Route for create comment for a specific post
postRoutes.post(
  "/:postId/comments",
  authenticateJWT,
  express.json(),
  commentController.createComment
);

// Route for get all comments realted to specific post
postRoutes.get(
  "/:postId/comments",
  authenticateJWT,
  commentController.getComments
);

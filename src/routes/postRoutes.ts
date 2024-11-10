import express from "express";
import * as postController from "../controllers/postController";
import * as categoryController from "../controllers/categoryController";
import * as commentController from "../controllers/commentController";

export const postRoutes = express.Router();

// Route for create post
postRoutes.post("/", express.json(), postController.createPost);

// Route for get all posts
postRoutes.get("/", postController.getALLPosts);

// Route for get a specific post
postRoutes.get("/:postId", postController.getPost);

// Route for update a specific post
postRoutes.put("/:postId", express.json(), postController.updatePost);

// Route for delete a specific post
postRoutes.delete("/:postId", postController.deletePost);

// Route for create category for a specific post
postRoutes.post(
  "/posts/:postId/categories",
  express.json(),
  categoryController.createCategory
);

// Route for get all categories realted to specific post
postRoutes.get("/posts/:postId/categories", categoryController.getCategories);

// Route for create comment for a specific post
postRoutes.post(
  "/posts/:postId/comments",
  express.json(),
  commentController.createComment
);

// Route for get all comments realted to specific post
postRoutes.get("/posts/:postId/comments", commentController.getComments);

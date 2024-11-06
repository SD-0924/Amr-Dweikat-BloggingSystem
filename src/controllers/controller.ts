// Import Request and Response from express module
import { Request, Response } from "express";

// Import all methods from model
import * as model from "../models/model";

// Import joi schema validator
import joi from "joi";

// Joi validation schema for create user
const createUserSchema = joi.object({
  userID: joi.number().integer().min(1),
  userName: joi.string().min(1).max(20).required(),
  password: joi.string().min(8).max(20).required(),
  email: joi.string().max(255).email().required(),
});

// Joi validation schema for update user
const updateUserSchema = joi.object({
  userName: joi.string().min(1).max(20).required(),
  password: joi.string().min(8).max(20).required(),
  email: joi.string().max(255).email().required(),
});

// Joi validation schema for create post
const createPostSchema = joi.object({
  postID: joi.number().integer().min(1),
  userID: joi.number().integer().min(1).required(),
  title: joi.string().min(1).max(255).required(),
  content: joi.string().min(1).max(255).required(),
});

// Joi validation schema for update post
const updatePostSchema = joi.object({
  title: joi.string().min(1).max(255).required(),
  content: joi.string().min(1).max(255).required(),
});

// Joi validation schema for create category
const createCategorySchema = joi.object({
  categoryID: joi.number().integer().min(1),
  name: joi.string().min(1).max(255).required(),
});

// Joi validation schema for create comment
const createCommentSchema = joi.object({
  commentID: joi.number().integer().min(1),
  content: joi.string().min(1).max(255).required(),
});

// To check if id in URL valid id or not
const isPositiveInteger = (str: string): boolean =>
  /^[1-9]\d*$/.test(str) && !str.includes(".");

// Create new user
export const createUser = async (req: Request, res: Response): Promise<any> => {
  // check if body request valid or not
  const { error, value } = createUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Invalid body request",
      message: error.details[0].message.replaceAll(`"`, `'`),
    });
  }

  // check if user already exist or not
  if (req.body.hasOwnProperty("userID")) {
    if (await model.getUser(req.body.userID)) {
      return res.status(409).json({
        error: "User already exists",
        message: "the user that you are trying to create already exists",
      });
    }
  }

  // check if other user using same email or not
  if (await model.isUserHasSameEmail(req.body.email)) {
    return res.status(400).json({
      error: "Invalid body request",
      message:
        "the email you are trying to use is already associated with another user",
    });
  }

  // create a new user
  const newUser = await model.createUser(req.body);
  res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
};

// Gett all users
export const getALLUsers = async (req: Request, res: Response): Promise<any> =>
  res.status(200).json(await model.getAllUsers());

// Get a specific user
export const getUser = async (req: Request, res: Response): Promise<any> => {
  // check if user id valid or not
  if (!isPositiveInteger(req.params.userId)) {
    return res.status(400).json({
      error: "Invalid user ID",
      message: "user ID must be a positive integer",
    });
  }

  // get user id from URL
  const userID = Number(req.params.userId);

  // return user information if it is exist
  const user = await model.getUser(userID);
  if (user) {
    return res.status(200).json(user);
  }

  // return error message because use does not exist
  return res.status(404).json({
    error: "User not found",
    message: "the user you are trying to fetch doest not exists",
  });
};

// Update a specific user
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  // check if user id valid or not
  if (!isPositiveInteger(req.params.userId)) {
    return res.status(400).json({
      error: "Invalid user ID",
      message: "user ID must be a positive integer",
    });
  }

  // get user id from URL
  const userID = Number(req.params.userId);

  // check user if it is exist or not
  if (!(await model.getUser(userID))) {
    return res.status(404).json({
      error: "User not found",
      message:
        "the user that you are trying to update their information does not exists",
    });
  }

  // check if body request valid or not
  const { error, value } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Invalid body request",
      message: error.details[0].message.replaceAll(`"`, `'`),
    });
  }

  // check if other user using same email or not
  const users = await model.isUserHasSameEmail(req.body.email);
  if (users && users.dataValues.userID !== userID) {
    return res.status(400).json({
      error: "Invalid body request",
      message: "there is a user already has the new email",
    });
  }

  // update user information
  await model.updateUser(userID, {
    userName: req.body.userName,
    password: req.body.password,
    email: req.body.email,
  });

  // fetch new user
  const newUser = await model.getUser(userID);
  res.status(200).json({
    message: "User updated successfully",
    user: newUser,
  });
};

// Delete a specific user
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  // check if user id valid or not
  if (!isPositiveInteger(req.params.userId)) {
    return res.status(400).json({
      error: "Invalid user ID",
      message: "user ID must be a positive integer",
    });
  }

  // get user id from URL
  const userID = Number(req.params.userId);

  // delete user based on id that user provided
  const result = await model.deleteUser(userID);

  // error message because user does not exist
  if (result === 0) {
    return res.status(404).json({
      error: "User not found",
      message: "the user you are trying to delete already not exists",
    });
  }

  // sucess message that user deleted
  res.status(200).json({
    message: "User deleted successfully",
  });
};

// Create new post
export const createPost = async (req: Request, res: Response): Promise<any> => {
  // check if body request valid or not
  const { error, value } = createPostSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Invalid body request",
      message: error.details[0].message.replaceAll(`"`, `'`),
    });
  }

  // check if post already exist or not
  if (req.body.hasOwnProperty("postID")) {
    if (await model.getPost(req.body.postID)) {
      return res.status(409).json({
        error: "Post already exists",
        message: "the post that you are trying to create already exists",
      });
    }
  }

  // check if user exist or not
  const user = await model.getUser(req.body.userID);
  if (!user) {
    return res.status(404).json({
      error: "User not found",
      message:
        "the user you are trying to associate with this post does not exists",
    });
  }

  // create a new post
  const { dataValues: newPost } = await model.createPost(req.body);
  delete newPost["userID"];
  newPost["user"] = user;
  res.status(201).json({
    message: "Post created successfully",
    post: newPost,
  });
};

// Update a specific post
export const updatePost = async (req: Request, res: Response): Promise<any> => {
  // check if post id valid or not
  if (!isPositiveInteger(req.params.postId)) {
    return res.status(400).json({
      error: "Invalid post ID",
      message: "post ID must be a positive integer",
    });
  }

  // get post id from URL
  const postID = Number(req.params.postId);

  // check post if it is exist or not
  if (!(await model.getPost(postID))) {
    return res.status(404).json({
      error: "Post not found",
      message:
        "the post that you are trying to update their information does not exists",
    });
  }

  // check if body request valid or not
  const { error, value } = updatePostSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Invalid body request",
      message: error.details[0].message.replaceAll(`"`, `'`),
    });
  }

  // update post
  await model.updatePost(postID, {
    title: req.body.title,
    content: req.body.content,
  });

  // fetch new post
  const { dataValues: newPost } = await model.getPost(postID);
  newPost["user"] = await model.getUser(newPost["userID"]);
  delete newPost["userID"];
  res.status(200).json({
    message: "Post updated successfully",
    post: newPost,
  });
};

// Delete a specific post
export const deletePost = async (req: Request, res: Response): Promise<any> => {
  // check if post id valid or not
  if (!isPositiveInteger(req.params.postId)) {
    return res.status(400).json({
      error: "Invalid post ID",
      message: "post ID must be a positive integer",
    });
  }

  // get user id from URL
  const postID = Number(req.params.postId);

  // delete user based on id that user provided
  const result = await model.deletePost(postID);

  // error message because post does not exist
  if (result === 0) {
    return res.status(404).json({
      error: "Post not found",
      message: "the post you are trying to delete already not exists",
    });
  }

  // sucess message that post deleted
  res.status(200).json({
    message: "Post deleted successfully",
  });
};

// Create new category for a specific post
export const createCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  // check if post id valid or not
  if (!isPositiveInteger(req.params.postId)) {
    return res.status(400).json({
      error: "Invalid post ID",
      message: "post ID must be a positive integer",
    });
  }

  // get post id from URL
  const postID = Number(req.params.postId);

  // check post if exist or not
  if (!(await model.getPost(postID))) {
    return res.status(404).json({
      error: "Post does not exists",
      message: "the post you're trying to work on does not exists",
    });
  }

  // check if body request valid or not
  const { error, value } = createCategorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Invalid body request",
      message: error.details[0].message.replaceAll(`"`, `'`),
    });
  }

  // check if category id already exist or not
  if (req.body.hasOwnProperty("categoryID")) {
    if (await model.getCategory(req.body.categoryID)) {
      return res.status(409).json({
        error: "Category id already exists",
        message: "the categoryID that you are trying to create already exists",
      });
    }
  }

  // check if category already exist or not
  const categories = await model.isCategoryExists(req.body.name);
  if (categories.length !== 0) {
    return res.status(409).json({
      error: "Category already exists",
      message: "the category that you are trying to create already exists",
    });
  }

  // create a new category
  const newCategory = await model.createCategory(postID, req.body);
  res.status(201).json({
    message: "Category created successfully",
    category: newCategory,
  });
};

// get all categories for specific post
export const getCategories = async (
  req: Request,
  res: Response
): Promise<any> => {
  // check if post id valid or not
  if (!isPositiveInteger(req.params.postId)) {
    return res.status(400).json({
      error: "Invalid post ID",
      message: "post ID must be a positive integer",
    });
  }

  // get post id from URL
  const postID = Number(req.params.postId);

  // check post if exist or not
  if (!(await model.getPost(postID))) {
    return res.status(404).json({
      error: "Post does not exists",
      message: "the post you're trying to work on does not exists",
    });
  }

  // get all comments
  const categories = await model.getCategories(postID);
  res.status(200).json(categories);
};

// Create new comment for a specific post
export const createComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  // check if post id valid or not
  if (!isPositiveInteger(req.params.postId)) {
    return res.status(400).json({
      error: "Invalid post ID",
      message: "post ID must be a positive integer",
    });
  }

  // get post id from URL
  const postID = Number(req.params.postId);

  // check post if exist or not
  if (!(await model.getPost(postID))) {
    return res.status(404).json({
      error: "Post does not exists",
      message: "the post you're trying to work on does not exists",
    });
  }

  // check if body request valid or not
  const { error, value } = createCommentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Invalid body request",
      message: error.details[0].message.replaceAll(`"`, `'`),
    });
  }

  // check if comment id already exist or not
  if (req.body.hasOwnProperty("commentID")) {
    if (await model.getComment(req.body.commentID)) {
      return res.status(409).json({
        error: "Comment id already exists",
        message: "the commentID that you are trying to create already exists",
      });
    }
  }

  // create a new comment
  const newComment = await model.createComment(postID, req.body);
  res.status(201).json({
    message: "Comment created successfully",
    comment: newComment,
  });
};

// get all comments for specific post
export const getComments = async (
  req: Request,
  res: Response
): Promise<any> => {
  // check if post id valid or not
  if (!isPositiveInteger(req.params.postId)) {
    return res.status(400).json({
      error: "Invalid post ID",
      message: "post ID must be a positive integer",
    });
  }

  // get post id from URL
  const postID = Number(req.params.postId);

  // check post if exist or not
  if (!(await model.getPost(postID))) {
    return res.status(404).json({
      error: "Post does not exists",
      message: "the post you're trying to work on does not exists",
    });
  }

  // get all comments
  const comments = await model.getComments(postID);
  res.status(200).json(comments);
};

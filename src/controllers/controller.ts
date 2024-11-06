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
        error: "User already esist",
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

// Get user information
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
    message: "the user you are trying to fetch doest not exist",
  });
};

// Update user information
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
        "the user that you are trying to update their information does not exist",
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

// Delete user
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
      message: "the user you are trying to delete already not exist",
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
        error: "Post already esist",
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
        "the user you are trying to associate with this post does not exis",
    });
  }

  // create a new user
  const { dataValues: newPost } = await model.createPost(req.body);
  delete newPost["userID"];
  newPost["user"] = user;
  res.status(201).json({
    message: "Post created successfully",
    post: newPost,
  });
};

// Import Request and Response from express module
import { Request, Response } from "express";

// Import User model
import { User } from "../models/userModel";

// Import joi schema validator
import joi from "joi";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "my-secret-key";

// Joi validation schema for user model
const userSchema = joi.object({
  userName: joi.string().min(1).max(20).required(),
  password: joi.string().min(8).max(20).required(),
  email: joi.string().max(255).email().required(),
});

// Joi validation schema for user login
const userLoginSchema = joi.object({
  password: joi.string().min(8).max(20).required(),
  email: joi.string().max(255).email().required(),
});

// Joi validation schema for userId property
const userIdSchema = joi.number().integer().min(1);

// Provide a token to user incase valid credentials
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  // check if body request valid or not
  const { error, value } = userLoginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Invalid body request",
      message: error.details[0].message.replaceAll(`"`, `'`),
    });
  }

  // Check credentials if valid or not
  const userInfo = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (
    !userInfo ||
    !(await bcrypt.compare(req.body.password, userInfo.dataValues.password))
  ) {
    return res.status(401).json({
      error: "error",
      message: "Invalid email or password",
    });
  }

  // return token to user
  const token = jwt.sign(
    {
      id: userInfo.dataValues.id,
      email: userInfo.dataValues.email,
    },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.status(200).json({ message: "Login successful", token });
};

// Create new user
export const createUser = async (req: Request, res: Response): Promise<any> => {
  // check if body request valid or not
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Invalid body request",
      message: error.details[0].message.replaceAll(`"`, `'`),
    });
  }

  // check if other user using same email or not
  if (
    await User.findOne({
      where: {
        email: req.body.email,
      },
    })
  ) {
    return res.status(400).json({
      error: "Invalid body request",
      message:
        "the email you are trying to use is already associated with another user",
    });
  }

  // create a new user
  const newUser = await User.create({
    userName: req.body.userName,
    password: req.body.password,
    email: req.body.email,
  });
  res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
};

// Gett all users
export const getALLUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  const users = await User.findAll();
  res.status(200).json(users);
};

// Get a specific user
export const getUser = async (req: Request, res: Response): Promise<any> => {
  // Validate userID using Joi
  const { error } = userIdSchema.validate(req.params.userId);
  if (error) {
    return res
      .status(400)
      .json({ message: "user id must be a positive integer" });
  }

  // get user id from URL
  const userID = Number(req.params.userId);

  // return user information if it is exist
  const user = await User.findByPk(userID);
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
  // Validate userID using Joi
  const { error: err } = userIdSchema.validate(req.params.userId);
  if (err) {
    return res
      .status(400)
      .json({ message: "user id must be a positive integer" });
  }

  // get user id from URL
  const userID = Number(req.params.userId);

  // check user if it is exist or not
  if (!(await User.findByPk(userID))) {
    return res.status(404).json({
      error: "User not found",
      message:
        "the user that you are trying to update their information does not exists",
    });
  }

  // check if body request valid or not
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Invalid body request",
      message: error.details[0].message.replaceAll(`"`, `'`),
    });
  }

  // check if other user using same email or not
  const users = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (users && users.dataValues.id !== userID) {
    return res.status(400).json({
      error: "Invalid body request",
      message: "there is a user already has the new email",
    });
  }

  // update user information
  await User.update(
    {
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
    },
    {
      where: { id: userID },
    }
  );

  // fetch new user
  const newUser = await User.findByPk(userID);
  res.status(200).json({
    message: "User updated successfully",
    user: newUser,
  });
};

// Delete a specific user
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  // Validate userID using Joi
  const { error: err } = userIdSchema.validate(req.params.userId);
  if (err) {
    return res
      .status(400)
      .json({ message: "user id must be a positive integer" });
  }

  // get user id from URL
  const userID = Number(req.params.userId);

  // delete user based on id that user provided
  const result = await User.destroy({
    where: {
      id: userID,
    },
  });

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

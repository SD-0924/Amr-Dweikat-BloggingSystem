// Import Request and Response from express module
import { Request, Response } from "express";

// Import user methods from model
import { User } from "../models/model";

// Import joi schema validator
import joi from "joi";

// Joi validation schema for create user
const createUserSchema = joi.object({
  userID: joi.number().integer().min(1),
  userName: joi.string().min(1).max(20).required(),
  password: joi.string().min(8).max(20).required(),
  email: joi.string().email().required(),
});

// Joi validation schema for update user
const updateUserSchema = createUserSchema.fork(["userID"], (schema) =>
  schema.required()
);

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
    if (await User.findByPk(req.body.userID)) {
      return res.status(409).json({
        error: "Invalid body request",
        message: "the user you are trying to create already exists",
      });
    }
  }

  // check if other user using same email or not
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user) {
    return res.status(400).json({
      error: "Invalid body request",
      message:
        "the email you are trying to use is already associated with another user",
    });
  }

  // create a new user
  let newUser;
  if (req.body.hasOwnProperty("userID")) {
    newUser = await User.create({
      userID: req.body.userID,
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
    });
  } else {
    newUser = await User.create({
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
    });
  }
  res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
};

// Gett all users
export const getALLUsers = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.status(200).json(users);
};

// Get user information
export const getUser = async (req: Request, res: Response): Promise<any> => {
  // check if user id valid or not
  const userID = Number(req.params.userId);
  if (isNaN(userID) || userID <= 0 || !Number.isInteger(userID)) {
    return res.status(400).json({
      error: "Invalid user ID",
      message: "user ID must be a positive integer",
    });
  }

  // return user information if it is exist
  const user = await User.findByPk(userID);
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
  const userID = Number(req.params.userId);
  if (isNaN(userID) || userID <= 0 || !Number.isInteger(userID)) {
    return res.status(400).json({
      error: "Invalid user ID",
      message: "user ID must be a positive integer",
    });
  }

  // check user if it is exist or not
  if (!(await User.findByPk(userID))) {
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

  // check if there is a user has the same new id or not
  if (await User.findByPk(req.body.userID)) {
    return res.status(400).json({
      error: "Invalid body request",
      message: "a user already has the new user ID",
    });
  }

  // check if other user using same email or not
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user) {
    return res.status(400).json({
      error: "Invalid body request",
      message: "a user already has the new email",
    });
  }

  // update user information
  await User.update(
    {
      userID: req.body.userID,
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
    },
    {
      where: { userID: userID },
    }
  );

  // fetch new user
  const newUser = await User.findByPk(req.body.userID);
  res.status(200).json({
    message: "User updated successfully",
    user: newUser,
  });
};

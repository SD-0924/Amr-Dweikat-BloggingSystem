// Import Request and Response from express module
import { Request, Response } from "express";

// Import joi schema validator
import joi from "joi";

// Joi validation schema for create user
const userSchema = joi.object({
  userID: joi
    .number()
    .integer()
    .min(1)
    .message("userID property must be positive integer number"),
  userName: joi
    .string()
    .min(1)
    .max(20)
    .required()
    .message(
      "userName property is required and must be a string that is at least 1 character long"
    ),
  password: joi
    .string()
    .min(8)
    .max(20)
    .required()
    .message(
      "password property is required and must be a string between 8 and 20 characters long"
    ),
  email: joi.string().email().required(),
  age: joi.number().integer().min(18).required(),
});

// Create user function
export const createUser = (req: Request, res: Response): any => {
  res.status(201).json({ message: "create user" });
};

// Gett all users function
export const getALLUsers = async (req: Request, res: Response) => {
  // await imageModel.resizeImage(
  //   req.params.imageName,
  //   req.body.width,
  //   req.body.height
  // );
  res.status(200).json({ message: "get all users" });
};

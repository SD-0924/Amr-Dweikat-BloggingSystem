import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { userJWTService } from "../services/userJWTService";

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // Extract token from Authorization header
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied, no token provided" });
  }

  // Check if token is valid or not
  if (!(await userJWTService.isTokenExist(token))) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Check if token is expired or not
  try {
    const decoded = jwt.verify(token, "my-secret-key");
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

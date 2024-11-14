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

  // Check if token exist and not expired
  if (
    !(await userJWTService.isTokenExist(token)) ||
    userJWTService.isTokenExpired(token)
  ) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Token is valid and not expired
  next();
};

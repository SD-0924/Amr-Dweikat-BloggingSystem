import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  // Extract token from Authorization header
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, "my-secret-key");
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Import Request , Response and NextFunction from express module
import { Request, Response, NextFunction } from "express";

// Handle invalid route
export const invalidRoute = (req: Request, res: Response): void => {
  res.status(404).json({
    error: "Route Not Found",
    message: "Sorry, that route does not exist",
  });
};

// Error handling middleware for JSON syntax errors and invalid form data
export const invalidJSON = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON structure",
      message: "Please provide valid JSON",
    });
  }
};

// Import express module
import express from "express";

// Import all error handler methods from errorHandler module
import { invalidRoute, invalidJSON } from "./middleware/errorHandler";

// Import Router method
import { userRoutes } from "./routes/userRoutes";
import { postRoutes } from "./routes/postRoutes";

// Load environment variables
require("dotenv").config();

// Initialize an Express application
export const app = express();

// Handle existing routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Middleware to handle invalid routes
app.use(invalidRoute);

// Middleware to handle invalid JSON structure
app.use(invalidJSON);

// Start the server
app.listen(Number(process.env.PORT), String(process.env.HOSTNAME), () => {
  console.log(
    `Server is running on http://${process.env.HOSTNAME}:${process.env.PORT}`
  );
});

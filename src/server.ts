// Import express module
import express from "express";

import { sequelize } from "./models/model";

// Import all error handler methods from errorHandler module
import { invalidRoute, invalidJSON } from "./utils/errorHandler";

// Import Router method
import route from "./routes/route";

// Initialize an Express application
const app = express();

// Server hostname and port
const HOSTNAME = "localhost";
const PORT = 3000;

// Handle existing routes after base URL
app.use(route);

// Middleware to handle invalid routes
app.use(invalidRoute);

// Middleware to handle invalid JSON structure
app.use(invalidJSON);

// Start the server
app.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
});

// Close sequelize connection on process termination
process.on("SIGINT", async () => {
  try {
    await sequelize.close(); // Close the connection pool
    console.log("Database connection closed");
  } catch (err) {
    console.error("Error closing database connection:", err);
    process.exit(1); // Exit with failure
  }
});

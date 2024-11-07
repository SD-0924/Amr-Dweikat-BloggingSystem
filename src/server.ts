// Import express module
import express from "express";

// Import all error handler methods from errorHandler module
import { invalidRoute, invalidJSON } from "./utils/errorHandler";

// Import Router method
import route from "./routes/route";

// Initialize an Express application
export const app = express();

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

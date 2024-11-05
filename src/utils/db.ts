// Import sequelize module
import { Sequelize, DataTypes } from "sequelize";

// Initialize Sequelize with MySQL database credentials
const sequelize = new Sequelize("blogging_system", "root", "Amr1234", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// Test the connection to the database
try {
  sequelize.authenticate();
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export { sequelize, DataTypes };

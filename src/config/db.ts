// Import sequelize module
import { Sequelize } from "sequelize";

// Initialize Sequelize with MySQL database credentials
// export const sequelize = new Sequelize("blogging_system", "root", "Amr1234", {
//   host: "localhost",
//   dialect: "mysql",
//   logging: false,
// });
export const sequelize = new Sequelize("test", "root", "Amr1234", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

import { sequelize } from "../config/db";
import { DataTypes } from "sequelize";
import { User } from "./userModel";

// Define the UserJWT model
export const UserJWT = sequelize.define(
  "UserJWT",
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  },
  {
    tableName: "user_jwt",
    timestamps: false,
  }
);

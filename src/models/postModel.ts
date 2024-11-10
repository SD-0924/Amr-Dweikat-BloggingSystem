import { sequelize } from "../config/db";
import { DataTypes } from "sequelize";
import { User } from "./userModel";

// Define the Post model
export const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "post",
    timestamps: true,
  }
);

// Set up the 1-to-many relationship between user and post
User.hasMany(Post, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
Post.belongsTo(User, {
  foreignKey: "userId",
});

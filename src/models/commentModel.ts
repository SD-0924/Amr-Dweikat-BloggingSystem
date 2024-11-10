import { sequelize } from "../config/db";
import { DataTypes } from "sequelize";
import { User } from "./userModel";
import { Post } from "./postModel";

// Define the Comment model
export const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    tableName: "comment",
    timestamps: true,
  }
);
// Set up the 1-to-many relationship between user and comment
User.hasMany(Comment, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
Comment.belongsTo(User, {
  foreignKey: "userId",
});
// Set up the 1-to-many relationship between post and comment
Post.hasMany(Comment, {
  foreignKey: "postId",
  onDelete: "CASCADE",
});
Comment.belongsTo(Post, {
  foreignKey: "postId",
});

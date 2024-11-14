import { sequelize } from "../config/db";
import { DataTypes } from "sequelize";
import { Post } from "./postModel";
import { Category } from "./categoryModel";

// Define the PostCategory model
export const PostCategory = sequelize.define(
  "PostCategory",
  {
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: Post,
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: "id",
      },
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: "post_category",
    timestamps: false,
  }
);

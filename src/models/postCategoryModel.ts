import { sequelize } from "../config/db";
import { DataTypes } from "sequelize";
import { Post } from "./postModel";
import { Category } from "./categoryModel";

// Define the Category model
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
  },
  {
    tableName: "post_category",
    timestamps: false,
  }
);

// Set up the Many-to-Many relationship between post and category
Post.belongsToMany(Category, {
  through: PostCategory,
  foreignKey: "postId",
  otherKey: "categoryId",
});
Category.belongsToMany(Post, {
  through: PostCategory,
  foreignKey: "categoryId",
  otherKey: "postId",
});

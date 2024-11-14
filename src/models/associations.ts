import { User } from "./userModel";
import { Post } from "./postModel";
import { Category } from "./categoryModel";
import { Comment } from "./commentModel";
import { PostCategory } from "./postCategoryModel";
import { UserJWT } from "./userJWTModel";

// Define associations between models
export const defineAssociations = () => {
  // Set up the 1-to-many relationship between user and token
  User.hasMany(UserJWT, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  UserJWT.belongsTo(User, {
    foreignKey: "userId",
  });

  // Set up the 1-to-many relationship between user and post
  User.hasMany(Post, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Post.belongsTo(User, {
    foreignKey: "userId",
  });

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
};

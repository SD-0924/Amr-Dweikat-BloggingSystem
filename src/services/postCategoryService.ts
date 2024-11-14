// Import postCategory model
import { PostCategory } from "../models/postCategoryModel";

export class postCategoryService {
  // Get a specific category for specific post
  static async getCategoryForPost(postId: number, categoryId: number) {
    return await PostCategory.findOne({
      where: {
        postId,
        categoryId,
      },
    });
  }
  // Create a specific category for specific post
  static async createCategoryForPost(postId: number, categoryId: number) {
    return await PostCategory.create({
      postId,
      categoryId,
    });
  }
  // Get all categories for specific post
  static async getCategoriesForPost(postId: number) {
    return await PostCategory.findAll({
      where: {
        postId,
      },
    });
  }
}

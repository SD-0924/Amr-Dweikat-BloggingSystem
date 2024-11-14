// Import category model
import { Category } from "../models/categoryModel";

export class categoryService {
  // Get a category by name
  static async getCategoryByName(categoryName: string) {
    return await Category.findOne({
      where: {
        name: categoryName,
      },
    });
  }
  // Create category
  static async createCategory(categoryName: string) {
    return await Category.create({
      name: categoryName,
    });
  }
  // Get a category by id
  static async getCategoryById(categoryId: number) {
    return await Category.findByPk(categoryId);
  }
}

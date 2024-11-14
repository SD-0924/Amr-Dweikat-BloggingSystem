// Import post model
import { Post } from "../models/postModel";

// Import services
import { userService } from "../services/userService";
import { postCategoryService } from "./postCategoryService";
import { categoryService } from "./categoryService";
import { commentService } from "./commentService";

export class postService {
  // Get a post by id
  static async getPostById(postId: number) {
    return await Post.findByPk(postId);
  }
  // Create post
  static async createPost(postInfo: any) {
    const { dataValues: newPost } = await Post.create({
      userId: postInfo.userId,
      title: postInfo.title,
      content: postInfo.content,
    });
    delete newPost["userId"];
    return newPost;
  }
  // Get all posts
  static async getPosts() {
    const posts = await Post.findAll();
    const result = [];

    for (let post of posts) {
      const userInfo = await userService.getUserById(post.dataValues.userId);
      delete userInfo?.dataValues.password;
      post.dataValues["user"] = userInfo?.dataValues;

      const categories = await postCategoryService.getCategoriesForPost(
        post.dataValues.id
      );

      const allCategories = [];
      for (const item of categories) {
        allCategories.push(
          await categoryService.getCategoryById(item.dataValues.categoryId)
        );
      }
      post.dataValues["categories"] = allCategories;
      post.dataValues["comments"] = await commentService.getComments(
        post.dataValues.id
      );

      for (const comment of post.dataValues["comments"]) {
        delete comment.dataValues["userId"];
        delete comment.dataValues["postId"];
      }
      delete post.dataValues["userId"];
      result.push(post);
    }
    return result;
  }
  // Get a specific post
  static async getFullPostInformation(postId: number) {
    const post = await Post.findByPk(postId);
    if (post) {
      post.dataValues["user"] = await userService.getUserById(
        post.dataValues.userId
      );
      delete post.dataValues["user"].dataValues["password"];
      const categories = await postCategoryService.getCategoriesForPost(
        post.dataValues.id
      );
      const allCategories = [];
      for (const item of categories) {
        allCategories.push(
          await categoryService.getCategoryById(item.dataValues.categoryId)
        );
      }
      post.dataValues["categories"] = allCategories;
      post.dataValues["comments"] = await commentService.getComments(
        post.dataValues.id
      );

      for (const comment of post.dataValues["comments"]) {
        delete comment.dataValues["userId"];
        delete comment.dataValues["postId"];
      }
      delete post.dataValues["userId"];
    }
    return post;
  }
  // Update post
  static async updatePost(postId: number, postInfo: any) {
    await Post.update(
      {
        title: postInfo.title,
        content: postInfo.content,
      },
      {
        where: { id: postId },
      }
    );
  }
  // Delete post
  static async deletePostById(postId: number) {
    return await Post.destroy({
      where: {
        id: postId,
      },
    });
  }
}

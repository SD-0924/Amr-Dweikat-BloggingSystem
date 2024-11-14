// Import comment model
import { Comment } from "../models/commentModel";

export class commentService {
  // Create comment
  static async createComment(userId: number, postId: number, content: string) {
    return await Comment.create({
      userId,
      postId,
      content,
    });
  }
  // Get all comments
  static async getComments(postId: number) {
    return await Comment.findAll({
      where: {
        postId,
      },
    });
  }
}

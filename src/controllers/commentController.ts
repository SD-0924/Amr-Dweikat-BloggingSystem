// Import Request and Response from express module
import { Request, Response } from "express";

// Import comment service
import { commentService } from "../services/commentService";

// Import post service
import { postService } from "../services/postService";

// Import joi schema validator
import joi from "joi";

// Joi validation schema for create comment
const createCommentSchema = joi.object({
  content: joi.string().min(1).max(255).required(),
});

// Joi validation schema for postId property
const postIdSchema = joi.number().integer().min(1);

// Create new comment for a specific post
export const createComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  // Validate postID using Joi
  const { error: err } = postIdSchema.validate(req.params.postId);
  if (err) {
    return res
      .status(400)
      .json({ message: "post id must be a positive integer" });
  }

  // get post id from URL
  const postID = Number(req.params.postId);

  // check post if exist or not
  const postInfo = await postService.getPostById(postID);
  if (!postInfo) {
    return res.status(404).json({
      error: "Post does not exists",
      message: "the post you're trying to work on does not exists",
    });
  }

  // check if body request valid or not
  const { error, value } = createCommentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Invalid body request",
      message: error.details[0].message.replaceAll(`"`, `'`),
    });
  }

  // create a new comment
  const newComment = await commentService.createComment(
    postInfo.dataValues.userId,
    postID,
    req.body.content
  );
  res.status(201).json({
    message: "Comment created successfully",
    comment: newComment,
  });
};

// get all comments for specific post
export const getComments = async (
  req: Request,
  res: Response
): Promise<any> => {
  // Validate postID using Joi
  const { error: err } = postIdSchema.validate(req.params.postId);
  if (err) {
    return res
      .status(400)
      .json({ message: "post ID must be a positive integer" });
  }

  // get post id from URL
  const postID = Number(req.params.postId);

  // check post if exist or not
  if (!(await postService.getPostById(postID))) {
    return res.status(404).json({
      error: "Post does not exists",
      message: "the post you're trying to work on does not exists",
    });
  }

  // get all comments
  const comments = await commentService.getComments(postID);
  res.status(200).json(comments);
};

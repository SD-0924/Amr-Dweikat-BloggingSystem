// Import Request and Response from express module
import { Request, Response } from "express";

// Import User model
import { User } from "../models/userModel";
import { Post } from "../models/postModel";
import { Category } from "../models/categoryModel";
import { Comment } from "../models/commentModel";
import { PostCategory } from "../models/postCategoryModel";

// Import joi schema validator
import joi from "joi";

// Joi validation schema for create post
const createPostSchema = joi.object({
  userId: joi.number().integer().min(1).strict().required(),
  title: joi.string().min(1).max(255).required(),
  content: joi.string().min(1).max(255).required(),
});

// Joi validation schema for update post
const updatePostSchema = joi.object({
  title: joi.string().min(1).max(255).required(),
  content: joi.string().min(1).max(255).required(),
});

// Joi validation schema for postId property
const postIdSchema = joi.number().integer().min(1);

// Create new post
export const createPost = async (req: Request, res: Response): Promise<any> => {
  // check if body request valid or not
  const { error, value } = createPostSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Invalid body request",
      message: error.details[0].message.replaceAll(`"`, `'`),
    });
  }

  // check if user exist or not
  const user = await User.findByPk(req.body.userID);
  if (!user) {
    return res.status(404).json({
      error: "User not found",
      message:
        "the user you are trying to associate with this post does not exists",
    });
  }

  // create a new post

  const { dataValues: newPost } = await Post.create({
    userId: req.body.userId,
    title: req.body.title,
    content: req.body.content,
  });
  delete newPost["userId"];
  newPost["user"] = user;
  delete newPost["user"].dataValues["password"];
  res.status(201).json({
    message: "Post created successfully",
    post: newPost,
  });
};

// Gett all posts
export const getALLPosts = async (
  req: Request,
  res: Response
): Promise<any> => {
  const posts = await Post.findAll();
  const result = [];

  for (let post of posts) {
    post.dataValues["user"] = await User.findByPk(post.dataValues.userId);
    delete post.dataValues["user"].dataValues["password"];
    const categories = await PostCategory.findAll({
      where: {
        postId: post.dataValues.id,
      },
    });
    const allCategories = [];
    for (const item of categories) {
      allCategories.push(await Category.findByPk(item.dataValues.categoryId));
    }
    post.dataValues["categories"] = allCategories;
    post.dataValues["comments"] = await Comment.findAll({
      where: {
        postId: post.dataValues.id,
      },
    });

    for (const comment of post.dataValues["comments"]) {
      delete comment.dataValues["userId"];
      delete comment.dataValues["postId"];
    }
    delete post.dataValues["userId"];
    result.push(post);
  }
  res.status(200).json(result);
};

// Gett a specific post
export const getPost = async (req: Request, res: Response): Promise<any> => {
  // Validate postID using Joi
  const { error: err } = postIdSchema.validate(req.params.postId);
  if (err) {
    return res
      .status(400)
      .json({ message: "post id must be a positive integer" });
  }

  // get post id from URL
  const postID = Number(req.params.postId);

  // return error message because post does not exist
  if (!(await Post.findByPk(postID))) {
    return res.status(404).json({
      error: "Post not found",
      message: "the post you are trying to fetch doest not exists",
    });
  }

  // return post information if it is exist
  const post = await Post.findByPk(postID);
  if (post) {
    post.dataValues["user"] = await User.findByPk(post.dataValues.userId);
    delete post.dataValues["user"].dataValues["password"];
    const categories = await PostCategory.findAll({
      where: {
        postId: post.dataValues.id,
      },
    });
    const allCategories = [];
    for (const item of categories) {
      allCategories.push(await Category.findByPk(item.dataValues.categoryId));
    }
    post.dataValues["categories"] = allCategories;
    post.dataValues["comments"] = await Comment.findAll({
      where: {
        postId: post.dataValues.id,
      },
    });

    for (const comment of post.dataValues["comments"]) {
      delete comment.dataValues["userId"];
      delete comment.dataValues["postId"];
    }
    delete post.dataValues["userId"];
  }

  return res.status(200).json(post);
};

// Update a specific post
export const updatePost = async (req: Request, res: Response): Promise<any> => {
  // Validate postID using Joi
  const { error: err } = postIdSchema.validate(req.params.postId);
  if (err) {
    return res
      .status(400)
      .json({ message: "post id must be a positive integer" });
  }

  // get post id from URL
  const postID = Number(req.params.postId);

  // check post if it is exist or not
  if (!(await Post.findByPk(postID))) {
    return res.status(404).json({
      error: "Post not found",
      message:
        "the post that you are trying to update their information does not exists",
    });
  }

  // check if body request valid or not
  const { error, value } = updatePostSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Invalid body request",
      message: error.details[0].message.replaceAll(`"`, `'`),
    });
  }

  // update post
  await Post.update(
    {
      title: req.body.title,
      content: req.body.content,
    },
    {
      where: { id: postID },
    }
  );

  // fetch new post
  const newPost = await Post.findByPk(postID);
  if (newPost) {
    newPost.dataValues["user"] = await User.findByPk(newPost.dataValues.userId);
    delete newPost.dataValues["user"].dataValues["password"];
    const categories = await PostCategory.findAll({
      where: {
        postId: newPost.dataValues.id,
      },
    });
    const allCategories = [];
    for (const item of categories) {
      allCategories.push(await Category.findByPk(item.dataValues.categoryId));
    }
    newPost.dataValues["categories"] = allCategories;
    newPost.dataValues["comments"] = await Comment.findAll({
      where: {
        postId: newPost.dataValues.id,
      },
    });

    for (const comment of newPost.dataValues["comments"]) {
      delete comment.dataValues["userId"];
      delete comment.dataValues["postId"];
    }
    delete newPost.dataValues["userId"];
  }
  res.status(200).json({
    message: "Post updated successfully",
    post: newPost,
  });
};

// Delete a specific post
export const deletePost = async (req: Request, res: Response): Promise<any> => {
  // Validate postID using Joi
  const { error: err } = postIdSchema.validate(req.params.postId);
  if (err) {
    return res
      .status(400)
      .json({ message: "post id must be a positive integer" });
  }

  // get user id from URL
  const postID = Number(req.params.postId);

  // delete user based on id that user provided
  const result = await Post.destroy({
    where: {
      id: postID,
    },
  });

  // error message because post does not exist
  if (result === 0) {
    return res.status(404).json({
      error: "Post not found",
      message: "the post you are trying to delete already not exists",
    });
  }

  // sucess message that post deleted
  res.status(200).json({
    message: "Post deleted successfully",
  });
};

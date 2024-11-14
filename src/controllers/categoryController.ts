// Import Request and Response from express module
import { Request, Response } from "express";

// Import joi schema validator
import joi from "joi";

// Import services
import { postService } from "../services/postService";
import { categoryService } from "../services/categoryService";
import { postCategoryService } from "../services/postCategoryService";

// Joi validation schema for create category
const categorySchema = joi.object({
  name: joi.string().min(1).max(255).required(),
});

// Joi validation schema for postId property
const postIdSchema = joi.number().integer().min(1);

// Create new category for a specific post
export const createCategory = async (
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
  if (!(await postService.getPostById(postID))) {
    return res.status(404).json({
      error: "Post does not exists",
      message: "the post you're trying to work on does not exists",
    });
  }

  // check if body request valid or not
  const { error, value } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Invalid body request",
      message: error.details[0].message.replaceAll(`"`, `'`),
    });
  }

  // check if post already has category or not
  let categoryInfo: any = await categoryService.getCategoryByName(
    req.body.name
  );
  if (categoryInfo) {
    if (
      await postCategoryService.getCategoryForPost(
        postID,
        categoryInfo.dataValues.id
      )
    ) {
      return res.status(409).json({
        error: "Category already assigned",
        message:
          "the category that you are trying to assign to the post is already assigned",
      });
    }
  }
  // create a new category
  if (!categoryInfo) {
    categoryInfo = await categoryService.createCategory(req.body.name);
  }
  await postCategoryService.createCategoryForPost(
    postID,
    categoryInfo.dataValues.id
  );
  res.status(201).json({
    message: "Category created successfully",
    category: categoryInfo,
  });
};

// get all categories for specific post
export const getCategories = async (
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
  if (!(await postService.getPostById(postID))) {
    return res.status(404).json({
      error: "Post does not exists",
      message: "the post you're trying to work on does not exists",
    });
  }

  // get all categories
  const categories = await postCategoryService.getCategoriesForPost(postID);
  const result = [];
  for (const category of categories) {
    result.push(
      await categoryService.getCategoryById(category.dataValues.categoryId)
    );
  }
  res.status(200).json(result);
};

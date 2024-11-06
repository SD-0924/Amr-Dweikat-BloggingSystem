// Import sequelize module
import { Sequelize, DataTypes } from "sequelize";

// Initialize Sequelize with MySQL database credentials
export const sequelize = new Sequelize("blogging_system", "root", "Amr1234", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// Define the User model
const User = sequelize.define(
  "user",
  {
    userID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "user",
    timestamps: true,
  }
);

// check if other user using same email or not
export const isUserHasSameEmail = async (email: string): Promise<any> =>
  await User.findOne({
    where: {
      email: email,
    },
  });

// create new user
export const createUser = async (userInfo: any): Promise<any> => {
  if (userInfo.hasOwnProperty("userID")) {
    return await User.create({
      userID: userInfo.userID,
      userName: userInfo.userName,
      password: userInfo.password,
      email: userInfo.email,
    });
  }
  return await User.create({
    userName: userInfo.userName,
    password: userInfo.password,
    email: userInfo.email,
  });
};

// get all users
export const getAllUsers = async (): Promise<any> => await User.findAll();

// get user
export const getUser = async (userID: number): Promise<any> =>
  await User.findByPk(userID);

// update user
export const updateUser = async (userID: number, userInfo: any): Promise<any> =>
  await User.update(
    {
      userName: userInfo.userName,
      password: userInfo.password,
      email: userInfo.email,
    },
    {
      where: { userID: userID },
    }
  );

// delete user
export const deleteUser = async (userID: number): Promise<any> =>
  await User.destroy({
    where: {
      userID: userID,
    },
  });

// Define the Category model
const Category = sequelize.define(
  "category",
  {
    categoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "category",
    timestamps: true,
  }
);

// Define the Post model
const Post = sequelize.define(
  "post",
  {
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "userID",
      },
      onDelete: "CASCADE",
    },
    postID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "post",
    timestamps: true,
  }
);

// Define the Post_Category model
const Post_Category = sequelize.define(
  "post_category",
  {
    postID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: "postID",
      },
      onDelete: "CASCADE",
    },
    categoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "categoryID",
      },
      onDelete: "CASCADE",
    },
    counter: {
      type: DataTypes.INTEGER,
      allowNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: "post_category",
    timestamps: false,
  }
);

// create new post
export const createPost = async (postInfo: any): Promise<any> => {
  if (postInfo.hasOwnProperty("postID")) {
    return await Post.create({
      userID: postInfo.userID,
      postID: postInfo.postID,
      title: postInfo.title,
      content: postInfo.content,
    });
  }
  return await Post.create({
    userID: postInfo.userID,
    title: postInfo.title,
    content: postInfo.content,
  });
};

// get post
export const getPost = async (postID: number): Promise<any> =>
  await Post.findByPk(postID);

// update post
export const updatePost = async (postID: number, postInfo: any): Promise<any> =>
  await Post.update(
    {
      title: postInfo.title,
      content: postInfo.content,
    },
    {
      where: { postID: postID },
    }
  );

// delete post
export const deletePost = async (postID: number): Promise<any> =>
  await Post.destroy({
    where: {
      postID: postID,
    },
  });

// check category exist or not
export const isCategoryExists = async (name: string): Promise<any> =>
  await Category.findAll({
    where: {
      name: name,
    },
  });

// create new category
export const createCategory = async (
  postID: number,
  categoryInfo: any
): Promise<any> => {
  if (categoryInfo.hasOwnProperty("categoryID")) {
    const category = await Category.create({
      categoryID: categoryInfo.categoryID,
      name: categoryInfo.name,
    });
    await Post_Category.create({
      categoryID: categoryInfo.categoryID,
      postID: postID,
    });
    return category;
  }
  const category = await Category.create({
    name: categoryInfo.name,
  });
  await Post_Category.create({
    categoryID: category.dataValues.categoryID,
    postID: postID,
  });
  return category;
};

// get category
export const getCategory = async (categoryID: number): Promise<any> =>
  await Category.findByPk(categoryID);

// get all categories
export const getCategories = async (postID: number): Promise<any> => {
  const categories = await Post_Category.findAll({
    where: {
      postID: postID,
    },
  });
  const result = [];
  for (const category of categories) {
    result.push(await getCategory(category.dataValues.categoryID));
  }
  return result;
};

// Define the Comment model
const Comment = sequelize.define(
  "comment",
  {
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "userID",
      },
      onDelete: "CASCADE",
    },
    postID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: "postID",
      },
      onDelete: "CASCADE",
    },
    commentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "comment",
    timestamps: true,
  }
);

// create new comment
export const createComment = async (
  postID: number,
  commentInfo: any
): Promise<any> => {
  const user = await getPost(postID);
  if (commentInfo.hasOwnProperty("commentID")) {
    return await Comment.create({
      userID: user.dataValues.userID,
      postID: postID,
      commentID: commentInfo.commentID,
      content: commentInfo.content,
    });
  }
  return await Comment.create({
    userID: user.dataValues.userID,
    postID: postID,
    content: commentInfo.content,
  });
};

// get comment
export const getComment = async (commentID: number): Promise<any> =>
  await Comment.findByPk(commentID);

// get all comments
export const getComments = async (postID: number): Promise<any> =>
  await Comment.findAll({
    where: {
      postID: postID,
    },
  });

// Import sequelize module
import { userInfo } from "os";
import { Sequelize, DataTypes } from "sequelize";

// Initialize Sequelize with MySQL database credentials
const sequelize = new Sequelize("blogging_system", "root", "Amr1234", {
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

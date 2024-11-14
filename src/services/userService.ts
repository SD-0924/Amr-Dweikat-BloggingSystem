// Import user model
import { User } from "../models/userModel";

export class userService {
  // Get a user by email
  static async getUserByEmail(email: string) {
    return await User.findOne({
      where: {
        email,
      },
    });
  }
  // Create user
  static async createUser(userInfo: any) {
    const newUser = await User.create({
      userName: userInfo.userName,
      password: userInfo.password,
      email: userInfo.email,
    });
    delete newUser.dataValues["password"];
    return newUser;
  }
  // Get all users
  static async getUsers() {
    const users = await User.findAll();
    for (const user of users) {
      delete user.dataValues.password;
    }
    return users;
  }
  // Get a user by id
  static async getUserById(userId: number) {
    return await User.findByPk(userId);
  }
  // Update user
  static async updateUser(userId: number, userInfo: any) {
    await User.update(
      {
        userName: userInfo.userName,
        password: userInfo.password,
        email: userInfo.email,
      },
      {
        where: { id: userId },
      }
    );
  }
  // Delete user
  static async deleteUserById(userId: number) {
    return await User.destroy({
      where: {
        id: userId,
      },
    });
  }
}

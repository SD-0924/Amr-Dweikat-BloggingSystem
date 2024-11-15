// Import user jwt model
import { UserJWT } from "../models/userJWTModel";

// Import jwt model
import jwt from "jsonwebtoken";

// Load environment variables
require("dotenv").config();

export class userJWTService {
  // Get a token by user id
  static async getTokenByUserId(userId: number) {
    const userInfo = await UserJWT.findOne({
      where: {
        userId,
      },
    });
    if (userInfo) {
      return userInfo.dataValues.token;
    }
  }
  // Check if token exist or not
  static async isTokenExist(token: string) {
    return await UserJWT.findOne({
      where: {
        token,
      },
    });
  }
  // Check if token expired or not
  static isTokenExpired(token: string): boolean {
    try {
      jwt.verify(token, String(process.env.JWT_SECRET));
      return false;
    } catch (err) {
      return true;
    }
  }
  // Add user with specific token
  static async addUserWithToken(userId: number, token: string) {
    await UserJWT.create({
      userId,
      token,
    });
  }
  // Remove token
  static async removeToken(token: string | undefined) {
    await UserJWT.destroy({
      where: {
        token,
      },
    });
  }
}

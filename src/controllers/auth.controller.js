import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { logger } from "../utils/logger.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.js";

class AuthController{
  // REGISTER
  register = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hash,
      });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.status(201).json({
        user,
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const check = await bcrypt.compare(password, user.password);
      if (!check) {
        return res.status(400).json({ message: "Wrong password" });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.json({
        user,
        accessToken,
        refreshToken,
      })
    } catch (err) {
      next(err);
    }
  };

  // REFRESH
  refresh = async (req, res) => {
    try {
      const { refreshToken } = req.body;

      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      const user = await User.findById(decoded.id);

      const newAccessToken = generateAccessToken(user);

      res.json({ accessToken: newAccessToken });
    } catch (err) {
      res.status(401).json({ message: "Invalid refresh token" });
    }
  };
}


export default new AuthController()
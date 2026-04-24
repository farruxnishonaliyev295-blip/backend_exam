import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

class UserController {
  async getAll(req, res) {
    try {
      const users = await User.find().select("-password");

      res.status(200).send({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send({ message: "Invalid ID" });
      }

      const user = await User.findById(id).select("-password");

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      res.status(200).send({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const { name, email, password, role } = req.body;

      const exists = await User.findOne({ email });

      if (exists) {
        return res.status(409).send({
          success: false,
          message: "Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      res.status(201).send({
        success: true,
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send({ message: "Invalid ID" });
      }

      const updateData = { ...req.body };

      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        returnDocument: "after",
        runValidators: true,
      }).select("-password");

      if (!updatedUser) {
        return res.status(404).send({ message: "User not found" });
      }

      res.status(200).send({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send({ message: "Invalid ID" });
      }

      const deleted = await User.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).send({ message: "User not found" });
      }

      res.status(200).send({
        success: true,
        message: "User deleted",
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}

export default new UserController();